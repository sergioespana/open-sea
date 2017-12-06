const loaderUtils = require('loader-utils');
const path = require('path');

module.exports = function () { };
module.exports.pitch = function (remainingRequest) {
	this.cacheable && this.cacheable();

	const filename = this.resourcePath.replace(path.resolve(__dirname, 'src'), '').replace(/\\/g, '/'),
		name = filename.replace(/(^\/(routes|components\/(routes|async))\/|(\/index)?\.js$)/g, '').replace(/\//g, '-');

	return `
		import { asyncComponent } from 'react-async-component';
		
		export default asyncComponent({
			resolve: () => new Promise((resolve) =>
				require.ensure(
					[],
					(require) => {
						resolve(require(${ loaderUtils.stringifyRequest(this, `!!${remainingRequest}`) }));
					},
					${JSON.stringify(name)}
				)
			)
		});
	`;
};