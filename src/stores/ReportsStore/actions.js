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

	const addModel = async (orgId, repId, model) => await firebase.setDoc(`organisations/${orgId}/reports/${repId}`, { model }).then(() => ({})).catch((error) => error);

	const linkData = (orgId, repId, path, eventPath = 'target.value') => action((event) => {
		const id = `${orgId}/${repId}`;
		const eventValue = get(event, eventPath);
		const value = toNumber(eventValue) || eventValue;
		
		let _data = getData(orgId, repId);
		set(_data, path, value);

		reports.updateItem(id, _data, '_id');
	});

	const getData = (orgId, repId) => {
		const id = `${orgId}/${repId}`;
		const report = reports.getItem(id, '_id');
		return report._data || report.data || {};
	};

	return {
		...reports,
		addModel,
		create,
		getData,
		getItems,
		linkData,
		parseTextToModel,
		validateModel
	};
};

export default actions;