import { observable } from 'mobx';

class AppStore {
	
	@observable isLoading = true;
	@observable drawerIsOpen = false;

	toggleDrawer = () => this.drawerIsOpen = !this.drawerIsOpen;
}

const appStore = new AppStore();
export default appStore;