import { Service } from 'react-services-injector';
import auth0 from 'auth0-js';

class AuthService extends Service {
	auth = new auth0.WebAuth({
		domain: 'seaman.eu.auth0.com',
		clientID: 'MXkeujpurxw72iqvBx19LkNX6XjYAmqO',
		redirectUri: 'http://localhost:8080',
		audience: 'https://seaman.eu.auth0.com/userinfo',
		responseType: 'token id_token',
		scope: 'openid profile email'
	});

	login = () => this.auth.authorize();

	logout = () => {
		localStorage.removeItem('access_token');
		localStorage.removeItem('id_token');
		localStorage.removeItem('expires_at');
	}

	parseHash = () => new Promise((resolve, reject) => {
		this.auth.parseHash((error, result) => {
			if (error) reject(error);
			if (result && result.accessToken && result.idToken) {
				this._setSession(result);
				resolve(true);
			}
			resolve(false);
		});
	});

	_setSession = (authResult) => {
		localStorage.setItem('access_token', authResult.accessToken);
		localStorage.setItem('id_token', authResult.idToken);
		localStorage.setItem('expires_at', JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime()));
	}

	get isAuthed() {
		return new Date().getTime() <= JSON.parse(localStorage.getItem('expires_at'));
	}
}

AuthService.publicName = 'AuthService';

export default AuthService;
