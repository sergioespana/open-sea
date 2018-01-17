import { eval as evaluate, round } from 'mathjs';
import { firebase, omitKeysWith } from '../helpers';
import { action } from 'mobx';
import AJV from 'ajv';
import { collection } from 'mobx-app';
import filter from 'lodash/filter';
import get from 'lodash/get';
import { safeLoad } from 'js-yaml';
import schema from '../helpers/schema.json';
import set from 'lodash/set';
import toNumber from 'lodash/toNumber';

const ajv = new AJV({
	coerceTypes: true,
	useDefaults: true
});

const actions = (state) => {

	const reports = collection(state.reports);

	const getItems = (obj) => filter(state.reports, obj);

	const create = async (orgId, obj) => {
		const id = obj._id;
		const path = `organisations/${orgId}/reports/${id}`;

		if (await firebase.docExists(path)) return ({ code: 'already-exists' });

		const report = { created: new Date(), ...omitKeysWith(obj, '_') };

		return await firebase.setDoc(path, report).then(() => ({})).catch((error) => error);
	};

	const parseTextToModel = (str) => safeLoad(str);

	const validateModel = (obj) => ajv.validate(schema, obj) || ajv.errors;


	// FIXME: These models are much too similar, can we create a single solution?.
	const addModel = async (orgId, repId, model) => await firebase.setDoc(`organisations/${orgId}/reports/${repId}`, { model, updated: new Date() }).then(() => ({})).catch((error) => error);
	
	const saveData = async (orgId, repId, data) => await firebase.setDoc(`organisations/${orgId}/reports/${repId}`, { data, updated: new Date() }).then(() => ({})).catch((error) => error);

	const linkData = (orgId, repId, path, eventPath = 'target.value') => action((event) => {
		const id = `${orgId}/${repId}`;
		const report = reports.getItem(id, '_id');
		const value = get(event, eventPath);
		const newData = set({}, path, toNumber(value) || value);
		
		reports.updateItem({ ...report,  _data: { ...report._data, ...newData } }, '_id');
	});

	const parseCount = (val, data) => {
		const test = 'count(met_002)';
		const match = /(count\(([^)]+)\))/ig.exec(test);
		return val.replace(match[1], (data[match[2]] || []).length || 0);
	};

	const computeNumber = (val, data) => {
		const value = parseCount(val, data);
		try { return round(evaluate(value, data), 2); }
		catch (error) { return 0; }
	};

	const compute = (orgId, repId, indId) => {
		const report = reports.getItem(`${orgId}/${repId}`, '_id');
		const data = report.data || report._data || {};
		const { type, value } = get(report, `model.indicators.${indId}`) || {};

		if (type === 'number' || type === 'percentage') return computeNumber(value, data);
		else if (type === 'text') return data[value];
		else if (type === 'list') return data[value].length;

		return null;
	};

	return {
		...reports,
		addModel,
		compute,
		create,
		getItems,
		linkData,
		parseTextToModel,
		saveData,
		validateModel
	};
};

export default actions;