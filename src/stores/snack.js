import { observable, computed } from 'mobx';

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class SnackService {

	snackbar = observable.map({});

	@computed get isOpen() { return this.snackbar.get('open'); }

	constructor() {
		this._reset();
	}

	show = async (message, autohide = 4000, action = null, actionMessage = null) => {
		if (!message || message === '') return;

		if (this.snackbar.get('open')) {
			if (message === this.snackbar.get('message')) return;

			clearTimeout(this.timeout);
			await this.hide();
		}

		this._set({
			message,
			action,
			actionMessage,
			open: true
		});

		if (autohide > 0) this.timeout = setTimeout(this.hide, autohide);
	}

	hide = async () => {
		this.snackbar.set('doClose', true);
		await wait(195);
		this._reset();
		return;
	}

	_set = (settings) => {
		let defaults = {
			open: false,
			doClose: false,
			message: '',
			action: null,
			actionMessage: null
		};

		let obj = Object.assign({}, defaults, settings);

		Object.keys(obj).forEach((key) => {
			this.snackbar.set(key, obj[key]);
		});
	}

	_reset = () => this._set({});
}

const snackService = new SnackService();
export default snackService;