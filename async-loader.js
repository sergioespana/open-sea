const loaderUtils = require('loader-utils');
const upperCamelCase = require('uppercamelcase');

module.exports = function () { };
module.exports.pitch = function (remainingRequest) {
	this.cacheable && this.cacheable();
	const options = loaderUtils.getOptions(this) || {};
	const moduleRequest = loaderUtils.stringifyRequest(this, `!!${remainingRequest}`);
	const moduleName = upperCamelCase(this.resourcePath
		.replace(options.nameContext, '')
		.toLowerCase()
		.substr(1)
		.replace(/.ts?x/g, '')
		.replace(/\\/g, '-')
		.replace(/index/, 'routes')
	);

	return `
		import Loadable from 'react-loadable';

		export default Loadable(Object.assign({
			loader: () => import(/* webpackChunkName: ${JSON.stringify(moduleName)} */ ${moduleRequest}),
			loading: () => null
		}, ${JSON.stringify(options)}));
	`;
};
