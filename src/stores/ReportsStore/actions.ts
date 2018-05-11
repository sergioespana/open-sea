import AJV from 'ajv';
import { safeLoad } from 'js-yaml';
import { isNumber, round } from 'lodash';
import * as FirebaseService from '../../services/FirebaseService';
import schema from '../../util/schema.json';
import { removePrivates } from '../helpers';
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

	const addModel = (mod: object, callbacks?: { onError?: Function, onSuccess?: Function }) => {
		const { _orgId, _repId } = mod;
		const model = { ...removePrivates(mod) };
		FirebaseService.saveDoc(`organisations/${_orgId}/reports/${_repId}`, { model }, callbacks);
	};

	const addData = (obj: object, callbacks?: { onError?: Function, onSuccess?: Function }) => {
		const { _orgId, _repId } = obj;
		const data = { ...removePrivates(obj) };
		FirebaseService.saveDoc(`organisations/${_orgId}/reports/${_repId}`, { data }, callbacks);
	};

	return {
		addData,
		addModel,
		compute,
		parseStrToJson,
		validateModel
	};
};
