import axios from 'axios';
//const axios = require('axios');

export const requestImplement = async (host, cred, method, pars) => {
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

export const requestValidate = async (host, cred) => {
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

/*host = 'henk.limequery.org';
name = 'hennyk';
password = 'zLMrBAVsQveTeOO6';
*/

// request('henk.limequery.org',['hennyk', 'zLMrBAVsQveTeOO6'],'add_survey',[10, 'test-1234', 'en', 'G']).catch(err => console.log(err));
// request('henk.limequery.org',['hennyk', 'zLMrBAVsQveTeOO6'],'set_language_properties',[10, { surveyls_description: 'test' }]);
