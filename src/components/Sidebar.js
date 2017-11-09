import { h } from 'preact';
import styled from 'styled-components';
import { Route, Link } from 'react-router-dom';
import Ripple from './Ripple';

import AssistantIcon from 'react-material-icon-svg/dist/AssistantIcon';
import ViewDashboardIcon from 'react-material-icon-svg/dist/ViewDashboardIcon';
import ClipboardTextIcon from 'react-material-icon-svg/dist/ClipboardTextIcon';
import AccountMultipleIcon from 'react-material-icon-svg/dist/AccountMultipleIcon';

const SidenavContent = ({ match: { params: { id } } }) => (
	<nav>
		<SidenavContentItem to={`/organisation/${id}/assistant`} label="Assistant" icon={<AssistantIcon />} />
		<SidenavContentItem to={`/organisation/${id}/overview`} label="Overview" icon={<ViewDashboardIcon />} />
		<SidenavContentItem to={`/organisation/${id}/reports`} label="Reports" icon={<ClipboardTextIcon />} />
		<SidenavContentItem to={`/organisation/${id}/sharing`} label="Sharing" icon={<AccountMultipleIcon />} />
	</nav>
);

let SidenavContentItem = ({ to, icon, label, ...props }) => (
	<Link to={to} {...props}>
		{ icon }
		{ label && <span>{ label }</span> }
		<Ripple />
	</Link>
);

SidenavContentItem = styled(SidenavContentItem)`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 72px;
	height: 72px;
	border-radius: 50%;
	text-decoration: none;
	color: inherit;
	color: rgba(0,0,0,0.54);
	fill: rgba(0,0,0,0.54);

	> svg {
		margin-bottom: 4px;
	}

	> span {
		font-size: 10px;
	}
`;

const Sidebar = (props) => (
	<aside {...props}>
		<Route path="/organisation/:id" component={SidenavContent} />
	</aside>
);

export default styled(Sidebar)`
	position: fixed;
	top: 64px;
	left: 0;
	bottom: 0;
	width: 74px;
	display: none;

	@media (min-width: 1025px) {
		display: block;
	}

	> nav {
		padding: 24px 0;
		display: flex;
		flex-direction: column;
	}
`;