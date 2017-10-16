import { Service } from 'react-services-injector';
import AJV from 'ajv';
import delve from 'dlv';
import mathjs from 'mathjs';
import yaml from 'js-yaml';
import schema from './schema.json';

const ajv = new AJV({
	allErrors: true,
	coerceTypes: true
});

class MVCService extends Service {

	loading = true;
	errors = null;
	model = null;
	metrics = {};

	serviceDidConnect = () => {
		// TODO: Load model from DB
		// [ ] Check for model on DB
		// [ ] If no model, set model to false and display error
		// [ ] If model is present, set it

		const MODEL_FOUND = false;
		if (!MODEL_FOUND) {
			this.model = false;
			// FIXME: figure out errors format
			this.errors = [{
				message: 'No model present on the server. Please upload one.'
			}];
		}

		this.loading = false;
		this.$update();
	}

	parseFile = (event) => {
		let file = event.target.files[0];
		if (file) {
			let fr = new FileReader();
			fr.onload = this._parseStringToModel;
			fr.readAsText(file);
			event.target.value = null;
		}
	};

	_parseStringToModel = (event) => {
		let str = event.target.result,
			model = yaml.safeLoad(str),
			valid = ajv.validate(schema, model);

		if (valid) {
			this.model = model;
			this.errors = false;
		}
		else {
			this.model = false;
			this.errors = ajv.errors;
		}

		this.$update();
	}

	linkMetrics = (key, eventPath) => {
		let path = key.split('.');

		return (event) => {
			let metrics = {},
				obj = metrics,
				value = delve(event, eventPath),
				i = 0;

			for ( ; i < path.lenght -1; i++) {
				obj = obj[path[i]] || (obj[path[i]] = !i && this.metrics[path[i]] || {});
			}

			obj[path[i]] = value;
			this.metrics = Object.assign(this.metrics, metrics);
		};
	}

	safeEval = (id) => {
		try {
			return mathjs.eval(this.model.indicators[id].value, this.metrics);
		}
		catch (e) {
			return false;
		}
	}
}

MVCService.publicName = 'MVCService';

export default MVCService;
