import { observable, computed } from 'mobx';

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class DialogService {

	dialog = observable.map({});

	@computed get isOpen() { return this.dialog.get('open'); }

	constructor() {
		this._reset();
	}

	show = async (title, content, actions, simple = false) => {
		if (this.dialog.get('open')) return;

		this._set({
			title,
			content,
			actions,
			open: true,
			simple
		});
	}

	hide = async () => {
		this.dialog.set('doClose', true);
		await wait(195);
		this._reset();
		return;
	}

	doAction = (func) => {
		this.hide();
		func();
	}

	_set = (settings) => {
		let defaults = {
			open: false,
			doClose: false,
			title: '',
			content: null,
			actions: null,
			simple: false
		};

		let obj = Object.assign({}, defaults, settings);

		Object.keys(obj).forEach((key) => {
			this.dialog.set(key, obj[key]);
		});
	}

	_reset = () => this._set({});
}

const dialogService = new DialogService();
export default dialogService;