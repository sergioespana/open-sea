import AJV from 'ajv';
import { safeLoad } from 'js-yaml';
import { find, findLastIndex, get, isNumber, isUndefined, last, map, round, sortBy, toNumber } from 'lodash';
import { Organisation, Report } from '../../domain/Organisation';
import * as FirebaseService from '../../services/FirebaseService';
import schema from '../../util/schema.json';
import { getCurrentUser, removePrivates } from '../helpers';
import math from '../math';

const ajv = new AJV({
	coerceTypes: true,
	useDefaults: true
});

export const actions = (state) => {

	const compute = (value: string, data: object) => roundIfNumber(math.eval(value, data), 2);

	const roundIfNumber = (val: any, precision?: number) => isNumber(val) ? round(val, precision) : val;

	const parseStrToJson = (str: string) => safeLoad(str);

	const validateModel = (obj: object) => {
		if (ajv.validate(schema, obj)) return { accepted: obj, errors: null };
		return { accepted: false, errors: ajv.errors };
	};

	const addModel = (mod: Report, callbacks?: { onError?: Function, onSuccess?: Function }) => {
		const { _orgId, _repId } = mod;
		const model = { ...removePrivates(mod) };
		// Add model to a report or to an organisation (only networks will call this function) depending
		// on whether _repId is set within the model.
		if (_repId) FirebaseService.saveDoc(`organisations/${_orgId}/reports/${_repId}`, { model, updated: new Date(), updatedBy: get(getCurrentUser(state), '_id') }, callbacks);
		else FirebaseService.saveDoc(`organisations/${_orgId}`, { model, updated: new Date() }, callbacks);
	};

	const addData = (obj: Report, callbacks?: { onError?: Function, onSuccess?: Function }) => {
		const { _orgId, _repId } = obj;
		const data = { ...removePrivates(obj) };
		FirebaseService.saveDoc(`organisations/${_orgId}/reports/${_repId}`, { data, updated: new Date(), updatedBy: get(getCurrentUser(state), '_id') }, callbacks);
	};

	const operators = {
		'>': (a, b) => a > b,
		'>=': (a, b) => a >= b,
		'<': (a, b) => a < b,
		'<=': (a, b) => a <= b,
		'==': (a, b) => a === b
	};

	const assess = (network: Organisation, organisation: Organisation) => {
		const model = network.model;
		const report = last(sortBy(organisation._reports, ['created']));
		// Return -1 ("no certification") if required inputs are missing.
		if (!model || !report || !model.certifications || !report.data) return -1;

		return map(model.certifications, (certification) => {
			const { requirements } = certification;
			const assessed = map(requirements, (requirement) => {
				const { indicator, operator } = requirement;
				const value = toNumber(requirement.value);
				const computed = compute(model.indicators[indicator].value, report.data);
				return { ...requirement, value, computed, pass: operators[operator](computed, value) };
			});

			return {
				...certification,
				requirements: assessed,
				pass: isUndefined(find(assessed, { pass: false }))
			};
		});
	};

	const getCertification = (network: Organisation, assessed) => {
		const model = network.model;
		if (assessed < 0) return -1;
		return get(model, `certifications[${findLastIndex(assessed, { pass: true })}]`) || -1;
	};

	return {
		assess,
		addData,
		addModel,
		compute,
		getCertification,
		parseStrToJson,
		validateModel
	};
};
