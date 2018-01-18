const loaderUtils = require('loader-utils');
const path = require('path');

// TODO: Add "pretty" error component

module.exports = function () { };
module.exports.pitch = function (remainingRequest) {
	this.cacheable && this.cacheable();

	const name = this.resourcePath
		.replace(path.resolve(__dirname, 'src'), '')
		.replace(/\\/g, '/')
		.replace(/.js/g, '')
		.trim()
		.substr(1)
		.split('/').map((part, i) => {
			if (i === 0) return '';
			if (part.toLowerCase() === 'index') return 'Routes';
			return part.substr(0, 1).toUpperCase() + part.substr(1);
		})
		.join('');
	const requestString = loaderUtils.stringifyRequest(this, `!!${remainingRequest}`);

	return `
		import { asyncComponent } from 'react-async-component';
		
		export default asyncComponent({
			resolve: () => new Promise((resolve) => require.ensure([], (require) => resolve(require(${ requestString })), ${JSON.stringify(name)}))
		});
	`;
};