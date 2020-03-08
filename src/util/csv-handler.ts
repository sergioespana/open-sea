const csvFilePath = __dirname + '/stakeholders.csv';
const csv = require('csvtojson');
const axios = require('axios');
const atob = require('atob');

const requestImplement = async (host, cred, method, pars) => {
	const url = `https://${host}/index.php/admin/remotecontrol`;
	const options = {
		headers: {
			//'user-agent': 'Apache-HttpClient/4.2.2 (java 1.5)',
			//host,
			path: '/index.php/admin/remotecontrol',
			//connection: 'keep-alive',
			'content-type': 'application/json'
		}
	};

	/*bij de options request naar de api krijg ik geen access-control-allow-headers terug.
	hierdoor werkt de api niet vanuit de browser*/

	const authBody = JSON.stringify({ method: 'get_session_key', params: cred, id: 1 });
	const authRes = await axios.post(url, authBody, options);
	const key = authRes.data.result;
	const body = JSON.stringify({ method, params: [key, ...pars], id: 1 });
	const res = await axios.post(url, body, options);
	const result = res.data.result;
	//console.log(res);
	//console.log(result);
	return result;
};

const requestValidate = async (host, cred) => {
	const url = `https://${host}/index.php/admin/remotecontrol`;
	const options = {
		headers: {
			//'user-agent': 'Apache-HttpClient/4.2.2 (java 1.5)',
			//host,
			path: '/index.php/admin/remotecontrol',
			//connection: 'keep-alive',
			'content-type': 'application/json'
		}
	};
	const authBody = JSON.stringify({ method: 'get_session_key', params: cred, id: 1 });
	const authRes = await axios.post(url, authBody, options);
	return authRes;
};

const response = requestImplement('henk.limequery.org',['hennyk', 'zLMrBAVsQveTeOO6'], 'export_responses',['235424)', 'json']).then(res => {
	const response = JSON.parse(atob(res));
	console.log(response.s7);
})
.catch(err => console.log(err));
