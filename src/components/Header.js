import { inject, observer } from 'mobx-react';
import AppBar from 'material-styled-components/AppBar';
import Avatar from 'material-styled-components/Avatar';
import { Link } from 'react-router-dom';
import React from 'react';
import styled from 'styled-components';

const Title = styled((props) => <Link to="/" {...props}>open<strong>SEA</strong></Link>)`
	color: white;
	text-decoration: none;
	font-size: 1.25em;
	font-weight: 300;

	& > strong { font-weight: 400 }
`;

const Header = inject('AuthStore', 'MVCStore')(observer(({ AuthStore, MVCStore }) => (
	<AppBar
		primary
		fixed
		dense
		title={<Title />}
		menuAction={MVCStore.toggleDrawer}
	>
		{ AuthStore.authed && (
			<Link to="/settings/profile">
				<Avatar
					size={32}
					src={AuthStore.findById('current', true).avatar}
				>{ AuthStore.findById('current', true).name }</Avatar>
			</Link>
		) }
	</AppBar>
)));

export default Header;