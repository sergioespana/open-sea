import { Service } from 'react-services-injector';
import AJV from 'ajv';
import yaml from 'js-yaml';
import schema from './schema.json';

const ajv = new AJV({
	allErrors: true,
	coerceTypes: true
});

class MVCService extends Service {

	parseModel = (event) => {
		const str = event.target.result,
			model = yaml.safeLoad(str),
			valid = ajv.validate(schema, model);

		if (valid) return Promise.resolve(model);
		return Promise.reject(ajv.errors);
	}

	// To be replaced by parseModel
	parseFile = (event) => {
		const str = event.target.result,
			obj = yaml.safeLoad(str);

		return this.validate(obj);
	}

	// To be replaced by parseModel
	validate = (obj) => new Promise((resolve, reject) => {
		const valid = ajv.validate(schema, obj);
		if (valid) resolve({ valid, model: obj });
		else reject(ajv.errors);
	});
}

MVCService.publicName = 'MVCService';

export default MVCService;
