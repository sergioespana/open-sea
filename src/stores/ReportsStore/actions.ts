import AJV from 'ajv';
import { safeLoad } from 'js-yaml';
import { find, findLastIndex, get, isNumber, isUndefined, map, round, toNumber } from 'lodash';
import { Certification, IndirectIndicator ,Report, Requirement, Survey } from '../../domain/Organisation';
import * as FirebaseService from '../../services/FirebaseService';
import schema from '../../util/schema.json';
import { getCurrentUser, removePrivates } from '../helpers';
import math from '../math';
import { isNullOrUndefined } from 'util';

const ajv = new AJV({
	coerceTypes: true,
	useDefaults: true
});

export const actions = (state) => {

	const compute = (value: string, data: object, unit?: string) => {
		if (unit) try {
			switch (unit) {
			case 'number': {
				const ret = roundIfNumber(math.eval(value, data), 2);
				return ret;
			}
			case 'date': {
				const ret = roundIfNumber(math.eval(value, data), 2);
				return ret;
			}
			case 'percentage': {
				return `${roundIfNumber(math.eval(value, data), 2) * 100}%`;
			}
			case 'text': {
				let returnstring = '';
				if (!isNullOrUndefined(data)) {
					const valarr = value.split('+');
					valarr.forEach(e => {
						const el = e.split(' ').join('');
						if (isNullOrUndefined(data[el])) returnstring = 'No responses available';
						else if (valarr.length > 1) returnstring += el + ': ' + data[el] + '\n';
						else returnstring = data[el];
					});
				} else returnstring = '0';
				return returnstring;
			}
			}
		} catch (error) {
			console.log(error);
			return 0;
		}
		else try {
			return roundIfNumber(math.eval(value, data), 2);
		} catch (error) {
			return 0;
		}
	};

	const roundIfNumber = (val: any, precision?: number) => isNumber(val) ? round(val, precision) : val;

	const parseStrToJson = (str: string) => {
		try { return safeLoad(str); } catch (e) {
			console.log(e);
			return e;
		}
	};

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
		else if (_orgId) FirebaseService.saveDoc(`organisations/${_orgId}`, { model, updated: new Date() }, callbacks);
		else FirebaseService.saveDoc(`models`, { ...model }, callbacks);
	};

	/*const addSurvey = (surv: Survey ,callbacks?: { onError?: Function, onSuccess?: Function }) => {
		const { _orgId, _repId } = surv;
		const survey = { ...removePrivates(surv) };
		FirebaseService.saveDoc(`organisations/${_orgId}/reports/${_repId}`, { survey, updated: new Date(), updatedBy: get(getCurrentUser(state), '_id') }, callbacks);
	};

	const updateSurvey = (_orgId, _repId, identifier, value ,callbacks?: { onError?: Function, onSuccess?: Function }) => {
		if (identifier === 'summary')
		FirebaseService.saveDoc(`organisations/${_orgId}/reports/${_repId}/survey`, { summary: value, updated: new Date(), updatedBy: get(getCurrentUser(state), '_id') }, callbacks);
	};*/

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
		'<': 'lower than',
		'<=': 'at most',
		'==': 'exactly'
	};

	const assess = (certifications: Certification[], indicators: IndirectIndicator[], report: Report) =>
		map(certifications, (certification: Certification) => {
			const { requirements } = certification;
			const assessed = map(requirements, (requirement: Requirement) => {
				// fixme: indicator --> indirectIndicator when new model is loaded..
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
		//addSurvey,
		addModel,
		compute,
		getCertificationIndex,
		parseStrToJson,
		operatorText,
		validateModel,
		//updateSurvey
	};
};
