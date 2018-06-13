import AJV from 'ajv';
import { safeLoad } from 'js-yaml';
import { find, findLastIndex, get, isNumber, isUndefined, map, round, toNumber } from 'lodash';
import { Certification, Indicator, Report, Requirement } from '../../domain/Organisation';
import * as FirebaseService from '../../services/FirebaseService';
import schema from '../../util/schema.json';
import { getCurrentUser, removePrivates } from '../helpers';
import math from '../math';

const ajv = new AJV({
	coerceTypes: true,
	useDefaults: true
});

export const actions = (state) => {

	const compute = (value: string, data: object) => {
		try {
			return roundIfNumber(math.eval(value, data), 2);
		} catch (error) {
			return 0;
		}
	};

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

	const operatorFunctions = {
		'>': (a, b) => a > b,
		'>=': (a, b) => a >= b,
		'<': (a, b) => a < b,
		'<=': (a, b) => a <= b,
		'==': (a, b) => a === b
	};

	const operatorText = {
		'>': 'more than',
		'>=': 'at least',
		'<': 'less than',
		'<=': 'at most',
		'==': 'exactly'
	};

	const assess = (certifications: Certification[], indicators: Indicator[], report: Report) =>
		map(certifications, (certification: Certification) => {
			const { requirements } = certification;
			const assessed = map(requirements, (requirement: Requirement) => {
				const { indicator, operator } = requirement;
				const value = toNumber(requirement.value);
				const _computed = compute(indicators[indicator].value, report.data);
				const evaluate = operatorFunctions[operator];
				return { ...requirement, value, _computed, _pass: evaluate(_computed, value) };
			});

			return {
				...certification,
				requirements: assessed,
				_pass: isUndefined(find(assessed, { _pass: false }))
			};
		});

	const getCertificationIndex = (certifications: Certification[]): { current: number, next: number } => {
		const current = findLastIndex(certifications, { _pass: true });
		const next = current + 1 > certifications.length ? -1 : current + 1;
		return { current, next };
	};

	return {
		assess,
		addData,
		addModel,
		compute,
		getCertificationIndex,
		parseStrToJson,
		operatorText,
		validateModel
	};
};
