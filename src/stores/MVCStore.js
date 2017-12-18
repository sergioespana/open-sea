import { observable } from 'mobx';

class MVCStore {
	@observable navExpanded;
	@observable createDrawerOpen = false;
	@observable searchDrawerOpen = false;

	constructor() {
		this.navExpanded = window.localStorage.getItem('navExpanded') === 'true';
	}

	toggleExpanded = () => {
		this.navExpanded = !this.navExpanded;
		window.localStorage.setItem('navExpanded', this.navExpanded);
	}

	toggleCreateDrawer = () => {
		this.createDrawerOpen = !this.createDrawerOpen;
	}

	toggleSearchDrawer = () => {
		this.searchDrawerOpen = !this.searchDrawerOpen;
	}
}

export default new MVCStore();