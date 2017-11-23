import { observable } from 'mobx';

class MVCStore {
	@observable loading = true;
	@observable drawerOpen = false;

	toggleDrawer = () => {
		this.drawerOpen = !this.drawerOpen;
	}
}

export default new MVCStore();