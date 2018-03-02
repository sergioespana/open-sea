const admin = require('firebase-admin');
const camelCase = require('camelcase');
const functions = require('firebase-functions');
const glob = require('glob');

admin.initializeApp(functions.config().firebase);

const files = glob.sync('./src/*.f.js', {
	cwd: __dirname,
	ignore: './node_modules/**'
});

files.forEach(file => {
	let name = camelCase(file.slice(0, -5).split('/').join('_'));

	!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === name
		? (exports[name] = require(file))
		: console.error('Something went wrong!');
});