import { Service } from 'react-services-injector';
import AJV from 'ajv';
import yaml from 'js-yaml';
import schema from './schema.json';

const ajv = new AJV({
	allErrors: true,
	coerceTypes: true
});

class YAMLService extends Service {
	parseFile = (event) => {
		const str = event.target.result,
			obj = yaml.safeLoad(str);

		return this.validate(obj);
	}

	validate = (obj) => new Promise((resolve, reject) => {
		const valid = ajv.validate(schema, obj);
		if (valid) resolve(valid);
		else reject(ajv.errors);
	});
}

YAMLService.publicName = 'YAMLService';

export default YAMLService;
