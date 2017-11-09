import { h } from 'preact';
import { observer } from 'mobx-react';
import { Route } from 'react-router-dom';
import Wrapper from './components/Wrapper';
import Menu, { MenuItem } from '../Menu';

import AssistantIcon from 'react-material-icon-svg/dist/AssistantIcon';
import ViewDashboardIcon from 'react-material-icon-svg/dist/ViewDashboardIcon';
import ClipboardTextIcon from 'react-material-icon-svg/dist/ClipboardTextIcon';
import AccountMultipleIcon from 'react-material-icon-svg/dist/AccountMultipleIcon';
import ArchiveIcon from 'react-material-icon-svg/dist/ArchiveIcon';
import DeleteIcon from 'react-material-icon-svg/dist/DeleteIcon';
import SettingsIcon from 'react-material-icon-svg/dist/SettingsIcon';
import MessageAlertIcon from 'react-material-icon-svg/dist/MessageAlertIcon';
import HelpCircleIcon from 'react-material-icon-svg/dist/HelpCircleIcon';

const OrganisationMenu = ({ match: { params: { id } } }) => (
	<Menu inline>
		<MenuItem to={`/organisation/${id}/assistant`} primary="Assistant" icon={<AssistantIcon />} />
		<MenuItem to={`/organisation/${id}/overview`} primary="Overview" icon={<ViewDashboardIcon />} />
		<MenuItem to={`/organisation/${id}/reports`} primary="Reports" icon={<ClipboardTextIcon />} />
		<MenuItem to={`/organisation/${id}/sharing`} primary="Sharing" icon={<AccountMultipleIcon />} />
	</Menu>
);

const SettingsMenu = ({ match: { params: { id } } }) => (
	<Menu inline>
		<MenuItem to={`/organisation/${id}/archive`} primary="Archive" icon={<ArchiveIcon />} />
		<MenuItem to={`/organisation/${id}/trash`} primary="Bin" icon={<DeleteIcon />} />
		<MenuItem to={`/organisation/${id}/settings`} primary="Organisation settings" icon={<SettingsIcon />} />
	</Menu>
);

const Drawer = (props, { mobxStores: { AppStore } }) => (
	<Wrapper open={AppStore.drawerIsOpen}>
		<Route path="/organisation/:id" component={OrganisationMenu} />
		<Route path="/organisation/:id" component={SettingsMenu} />
		
		<Menu inline>
			<MenuItem to={`/feedback`} primary="Send feedback" icon={<MessageAlertIcon />} />
			<MenuItem to={`/help`} primary="Get help" icon={<HelpCircleIcon />} />
			<MenuItem to="/settings" primary="Settings" icon={<SettingsIcon />} />
		</Menu>
	</Wrapper>
);

export default observer(Drawer);