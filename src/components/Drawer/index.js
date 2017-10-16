import { h } from 'preact';
import DrawerDivider from '../DrawerDivider';
import DrawerItem from '../DrawerItem';
import DrawerContainer from '../DrawerContainer';

const Drawer = ({ isOpen, toggleDrawer }, { services: { AuthService } }) => (
	<DrawerContainer isOpen={isOpen} toggleDrawer={toggleDrawer}>
		<DrawerDivider />
		<DrawerItem href="/assistant" icon="assistant" label="Assistant" />
		<DrawerItem href="/" icon="dashboard" label="Dashboard" />
		<DrawerItem href="/input" icon="playlist_add" label="Input data" />
		<DrawerItem href="/sharing" icon="people" label="Sharing" />
		<DrawerDivider />
		<DrawerItem href="/archive" icon="archive" label="Archive" />
		<DrawerDivider />
		<DrawerItem href="/settings" icon="settings" label="Settings" />
		<DrawerItem href="/feedback" icon="feedback" label="Send feedback" />
		<DrawerItem href="/help" icon="help" label="Help" />
	</DrawerContainer>
);

export default Drawer;
