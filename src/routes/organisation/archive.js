import { h } from 'preact';
import Main from '../../components/Main';
import Container from '../../components/Container';

const Archive = ({ match: { params: { id } } }, { mobxStores: { OrgStore } }) => (
	<Main>
		<Container>
			<h1>Archive</h1>
		</Container>
	</Main>
);

export default Archive;