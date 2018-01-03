import { eval as evaluate, round } from 'mathjs';
import { action } from 'mobx';
import AJV from 'ajv';
import findLastKey from 'lodash/findLastKey';
import { firebase } from './helpers';
import get from 'lodash/get';
import replace from 'lodash/replace';
import { safeLoad } from 'js-yaml';
import schema from './schema.json';
import slug from 'slug';

const ajv = new AJV({
	coerceTypes: true,
	useDefaults: true
});

const reportsActions = (state) => {

	const findByOrgId = (id) => get(state, `reports.${id}`) || {};

	const findById = (orgId, id) => get(state, `reports.${orgId}.${id}`) || {};

	const findMostRecentWithKey = (id, key) => findById(id, findLastKey(findByOrgId(id), key));

	const createReport = async (obj) => {
		const { name, _orgId } = obj;
		const id = slug(name, { lower: true });
		const report = { _id: id, created: new Date(), ...obj };
		// Check if the report already exists.
		if ((await firebase.getDoc(`organisations/${_orgId}/reports/${id}`)).exists) return new Error('Report already exists.');
		// Store the new report in the database.
		await firebase.setDoc(`organisations/${_orgId}/reports/${id}`, obj);
		// Return the newly created report.
		return report;
	};

	const addModel = (orgId, repId, model) => setReport(orgId, repId, { model }, { merge: true, updateRemote: true });

	const parseCount = (str, data = {}) => replace(str, /(count\(([^)]+)\))/ig, (...args) => (get(data, args[2]) || []).length);

	const computeNumber = (value, data) => {
		try { return round(evaluate(parseCount(value, data), data), 2); }
		catch (e) { return 0; }
	};

	const computeIndicator = (orgId, repId, { type, value }) => {
		const report = findById(orgId, repId);
		const data = get(report, `data`) || {};

		if (type === 'number' || type === 'percentage') return computeNumber(value, data);
		if (type === 'text') return get(data, value) || '';
		if (type === 'list') return (get(data, value) || []).length;
	};

	const parseTextToModel = (str) => safeLoad(str);

	const validateModel = (obj) => ajv.validate(schema, obj) || ajv.errors;

	const setReport = action((orgId, repId, obj, options = {}) => {
		const { merge, updateRemote } = options;
		const report = { ...obj, updated: new Date() };

		if (merge) state.reports[orgId][repId] = { ...state.reports[orgId][repId], ...report };
		else state.reports[orgId][repId] = report;

		if (updateRemote) firebase.setDoc(`organisations/${orgId}/reports/${repId}`, report);
	});

	return {
		addModel,
		computeIndicator,
		createReport,
		findById,
		findByOrgId,
		findMostRecentWithKey,
		parseTextToModel,
		validateModel
	};
};

const ReportsStore = (state, initialData) => {

	const actions = reportsActions(state);

	return actions;
};

export default ReportsStore;