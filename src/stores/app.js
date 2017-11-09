import { observable } from 'mobx';

class AppStore {
	
	@observable isLoading = true;
	@observable drawerIsOpen = false;

	toggleDrawer = () => {
		if (this.drawerIsOpen) {
			this.drawerIsOpen = false;
			setTimeout(() => window.removeEventListener('click', this.handleWindowClick), 195);
		}
		else {
			this.drawerIsOpen = true;
			setTimeout(() => window.addEventListener('click', this.handleWindowClick), 225);
		}
	}

	handleWindowClick = (event) => {
		this.toggleDrawer();
	}
}

const appStore = new AppStore();
export default appStore;