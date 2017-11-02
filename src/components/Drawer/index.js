import { h } from 'preact';
import { observer } from 'mobx-react';
import Wrapper from './components/Wrapper';
import Menu, { MenuItem } from '../Menu';

const Drawer = ({ match: { params: { org } }, open }, { mobxStores: { store: { drawerIsOpen } } }) => org ? (
	<Wrapper open={drawerIsOpen}>
		<Menu inline>
			<MenuItem to={`/${org}/assistant`}>Assistant</MenuItem>
			<MenuItem to={`/${org}`}>Dashboard</MenuItem>
			<MenuItem to={`/${org}/data`}>Data</MenuItem>
			<MenuItem to={`/${org}/sharing`}>Sharing</MenuItem>
			<MenuItem to={`/${org}/settings`}>Settings</MenuItem>
		</Menu>
	</Wrapper>
) : null;

export default observer(Drawer);