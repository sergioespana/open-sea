import { h } from 'preact';
import { observer } from 'mobx-react';
import Wrapper from './components/Wrapper';
import Menu, { MenuItem } from '../Menu';

const Drawer = ({ match: { params: { id } }, open }, { mobxStores: { AppStore: { drawerIsOpen } } }) => (
	<Wrapper open={drawerIsOpen}>
		<Menu inline>
			<MenuItem to={`/${id}/assistant`} primary="Assistant" />
			<MenuItem to={`/${id}/overview`} primary="Overview" />
			<MenuItem to={`/${id}/settings`} primary="Settings" />
		</Menu>
	</Wrapper>
);

export default observer(Drawer);