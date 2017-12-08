import AJV from 'ajv';
import get from 'lodash/get';
import schema from './schema.json';
import trim from 'lodash/trim';
import trimEnd from 'lodash/trimEnd';
import yaml from 'js-yaml';

class YAMLStore {
	ajv;

	constructor() {
		this.ajv = new AJV({
			coerceTypes: true,
			useDefaults: true
		});
	}

	parse = (str) => yaml.safeLoad(str);

	validate = (model) => this.ajv.validate(schema, model);

	buildErrorMessage = (model) => {
		const [ error ] = this.ajv.errors,
			fieldPath = trim(error.dataPath, '.'),
			fieldPathArr = fieldPath.split('.'),
			field = fieldPathArr[fieldPathArr.length - 1],
			value = get(model, fieldPath),
			objectPath = fieldPath.split('.')[0],
			object = get(model, objectPath),
			objectType = trimEnd(objectPath.split('[')[0], 's');

		return `Field "${field}" in ${objectType} "${object.id}" ${error.message} (currently "${value}")`;
	}
}

export default new YAMLStore();