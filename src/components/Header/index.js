import { h } from 'preact';
import { Link } from 'react-router-dom';
import Avatar from '../Avatar';

import Wrapper from './components/Wrapper';
import Container from './components/Container';
import MenuButton from './components/MenuButton';
import Title from './components/Title';

const Header = (props, { router: { history: { push } }, mobxStores: { AppStore, AuthStore } }) => {
	let name = AuthStore.user.get('name');
	return (
		<Wrapper>
			<Container>
				<MenuButton onClick={AppStore.toggleDrawer} />
				<Title><Link to="/">open<strong>SEA</strong></Link></Title>
			</Container>
			<Container>
				{ AuthStore.isAuthed && <Link to="/account" style={{ textDecoration: 'none' }}><Avatar src={AuthStore.user.get('avatar')}>{ name ? name.full : 'AC' }</Avatar></Link> }
			</Container>
		</Wrapper>
	);
};

export default Header;