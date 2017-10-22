import { h } from 'preact';
import List from 'material-ui/List';
import DrawerContainer from '../DrawerContainer';
import DrawerItem from '../DrawerItem';
import DrawerDivider from '../DrawerDivider';

import AssistantIcon from 'material-ui-icons/Assistant';
import DashboardIcon from 'material-ui-icons/Dashboard';
import PlaylistAddIcon from 'material-ui-icons/PlaylistAdd';
import PeopleIcon from 'material-ui-icons/People';
import ArchiveIcon from 'material-ui-icons/Archive';
import SettingsIcon from 'material-ui-icons/Settings';
import FeedbackIcon from 'material-ui-icons/Feedback';
import HelpIcon from 'material-ui-icons/Help';

const Drawer = ({ isOpen, toggleDrawer }, { services: { AuthService } }) => (
	<DrawerContainer isOpen={isOpen} toggleDrawer={toggleDrawer}>
		<List>
			<DrawerDivider />
			<DrawerItem href="/assistant" icon={<AssistantIcon />} label="Assistant" />
			<DrawerItem href="/" icon={<DashboardIcon />} label="Dashboard" />
			<DrawerItem href="/input" icon={<PlaylistAddIcon />} label="Input data" />
			<DrawerItem href="/sharing" icon={<PeopleIcon />} label="Sharing" />
			<DrawerDivider />
			<DrawerItem href="/archive" icon={<ArchiveIcon />} label="Archive" />
			<DrawerDivider />
			<DrawerItem href="/settings" icon={<SettingsIcon />} label="Settings" />
			<DrawerItem href="/feedback" icon={<FeedbackIcon />} label="Send feedback" />
			<DrawerItem href="/help" icon={<HelpIcon />} label="Help" />
		</List>
	</DrawerContainer>
);

export default Drawer;
