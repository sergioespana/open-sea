const csvFilePath = __dirname + '/stakeholders.csv';
const csv = require('csvtojson');

csv()
.fromFile()
.then((jsonObj) => {
	console.log(jsonObj);
});