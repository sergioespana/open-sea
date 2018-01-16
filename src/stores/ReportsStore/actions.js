import { firebase, omitKeysWith } from '../helpers';
import { action } from 'mobx';
import AJV from 'ajv';
import { collection } from 'mobx-app';
import get from 'lodash/get';
import isNull from 'lodash/isNull';
import { safeLoad } from 'js-yaml';
import schema from '../helpers/schema.json';
import set from 'lodash/set';
import toNumber from 'lodash/toNumber';

const ajv = new AJV({
	coerceTypes: true,
	useDefaults: true
});

const actions = (state) => {

	const organisations = collection(state.organisations);

	const getCollection = (orgId) => {
		const organisation = organisations.getItem(orgId, '_id');
		return isNull(organisation) ? null : collection(organisation._reports || []);
	};
	
	const addItem = (...args) => {
		const collection = getCollection(args[0]);
		return isNull(collection) ? null : collection.addItem(...args.slice(1));
	};

	const addItems = (...args) => {
		const collection = getCollection(args[0]);
		return isNull(collection) ? null : collection.addItems(...args.slice(1));
	};

	const clear = (...args) => {
		const collection = getCollection(args[0]);
		return isNull(collection) ? null : collection.clear(...args.slice(1));
	};
	
	const getByIndex = (...args) => {
		const collection = getCollection(args[0]);
		return isNull(collection) ? null : collection.getByIndex(...args.slice(1));
	};

	const getIndex = (...args) => {
		const collection = getCollection(args[0]);
		return isNull(collection) ? null : collection.getIndex(...args.slice(1));
	};

	const getItem = (...args) => {
		const collection = getCollection(args[0]);
		return isNull(collection) ? null : collection.getItem(...args.slice(1));
	};
	
	const removeItem = (...args) => {
		const collection = getCollection(args[0]);
		return isNull(collection) ? null : collection.removeItem(...args.slice(1));
	};

	const setItems = (...args) => {
		const collection = getCollection(args[0]);
		return isNull(collection) ? null : collection.setItems(...args.slice(1));
	};

	const updateItem = (...args) => {
		const collection = getCollection(args[0]);
		return isNull(collection) ? null : collection.updateItem(...args.slice(1));
	};

	const updateOrAdd = (...args) => {
		const collection = getCollection(args[0]);
		return isNull(collection) ? null : collection.updateOrAdd(...args.slice(1));
	};

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
		const report = getItem(orgId, repId, '_id');
		const eventValue = get(event, eventPath);
		const value = toNumber(eventValue) || eventValue;
		
		let _data = getData(orgId, repId);
		set(_data, path, value);

		updateItem(orgId, { ...report, _data }, '_id');
	});

	const getData = (orgId, repId) => {
		const report = getItem(orgId, repId, '_id');
		return report._data || report.data || {};
	};

	return {
		addItem,
		addItems,
		clear,
		getByIndex,
		getIndex,
		getItem,
		removeItem,
		setItems,
		updateItem,
		updateOrAdd,
		addModel,
		create,
		getData,
		linkData,
		parseTextToModel,
		validateModel
	};
};

export default actions;