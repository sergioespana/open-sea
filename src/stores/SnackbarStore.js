import delay from 'delay';
import { observable } from 'mobx';

class SnackbarStore {
	timeout = null;
	snackbar = observable.map({
		open: false,
		message: '',
		action: null,
		actionMessage: null
	});

	show = async (message, autohideDuration = 4000, actionMessage, action) => {
		if (!message || message === '') return;

		if (this.snackbar.get('open')) {
			if (this.snackbar.get('message') === message) return;
			
			this.hide();
			await delay(225);
		}

		this.snackbar.set('message', message)
			.set('action', this._getAction(action))
			.set('actionMessage', actionMessage)
			.set('open', true);

		if (autohideDuration > 0) this.timeout = setTimeout(this.hide, autohideDuration);
	}

	hide = () => {
		clearTimeout(this.timeout);
		this.snackbar.set('open', false);
	}

	_getAction = (action) => () => {
		this.hide();
		action();
	}
}

export default new SnackbarStore();