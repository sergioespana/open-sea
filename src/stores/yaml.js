import AJV from 'ajv';
import yaml from 'js-yaml';
import schema from './schema.json';

import snackStore from './snack';
import fbStore from './firebase';

class YamlService {

	ajv;

	constructor() {
		this.ajv = new AJV({ coerceTypes: true });
	}

	handleFileUpload = (id, file) => {
		let fr = new FileReader();
		fr.onload = (event) => this.handleFileLoad(id, event);
		fr.readAsText(file);
	}

	handleFileLoad = async (id, { target: { result } }) => {
		if (!result) return snackStore.show('Unable to read the selected file');

		let model = this.parse(result) || {},
			valid = this.validate(model);
		
		if (!valid) return snackStore.show(this._buildErrorMessage(model));

		snackStore.show('Saving model...', 0);
		await fbStore.setDoc(`organisations/${id}`, { model });
		snackStore.show('Model saved', 4000, () => console.log('TODO: Undo model store'), 'UNDO');
	}

	parse = (str) => yaml.safeLoad(str);

	validate = (model) => this.ajv.validate(schema, model);

	_buildErrorMessage = (model) => {
		let error = this.ajv.errors[0];

	}
}

const yamlService = new YamlService();
export default yamlService;