import { h } from 'preact';
import { Link } from 'react-router-dom';

import Wrapper from './components/Wrapper';
import Container from './components/Container';
import Title from './components/Title';

const Header = (props, { router: { history: { push } }, mobxStores: { AppStore, AuthStore, OrgStore } }) => (
	<Wrapper>
		<Container>
			<Title><Link to="/">open<strong>SEA</strong></Link></Title>
		</Container>
		<Container>
			{ AuthStore.isAuthed && <Link to="/settings/profile">Profile</Link> }
		</Container>
	</Wrapper>
);

export default Header;