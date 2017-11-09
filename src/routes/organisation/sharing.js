import { h } from 'preact';
import Main from '../../components/Main';
import Container from '../../components/Container';

const Sharing = ({ match: { params: { id } } }, { mobxStores: { OrgStore } }) => (
	<Main>
		<Container>
			<h1>Sharing</h1>
		</Container>
	</Main>
);

export default Sharing;