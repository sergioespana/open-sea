import { h } from 'preact';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Wrapper from './components/Wrapper';
import MenuButton from './components/MenuButton';
import Title from './components/Title';

// import ProjectSelect from './components/ProjectSelect';
// import { Option } from '../Select';
// <ProjectSelect value={org} onChange={(value) => push(`/${value}`)}>
// 	<Option value="" text="See all" />
// 	{ map(store.organisations, (org, id) => (
// 		<Option value={id} text={ org.name } />
// 	)) }
// </ProjectSelect>

const Logout = styled.p`
	margin: 0;
	position: absolute;
	right: 0;
	margin-right: 20px;
`;

const Header = (props, { router: { history: { push } }, mobxStores: { store } }) => (
	<Wrapper>
		<MenuButton onClick={store.toggleDrawer} />
		<Title><Link to="/">open<strong>SEA</strong></Link></Title>
		{ store.isAuthed && <Logout><Link to="/account/logout">logout</Link></Logout> }
	</Wrapper>
);

export default Header;