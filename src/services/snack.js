import { Service } from 'react-services-injector';

class SnackService extends Service {

	open = false;
	props = {};
	
	show = (message, props = {}) => {
		this.message = message;
		this.props = props;
		this.open = true;
		this.$update();
	}
	
	_onRequestClose = (event, reason) => {
		if (reason === 'clickaway') return;
		this.open = false;
		this.$update();
	}
	
	hide = this._onRequestClose;
}

SnackService.publicName = 'SnackService';

export default SnackService;
