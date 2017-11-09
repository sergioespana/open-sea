import { h } from 'preact';
import Main from '../../components/Main';
import Container from '../../components/Container';

const Trash = ({ match: { params: { id } } }, { mobxStores: { OrgStore } }) => (
	<Main>
		<Container>
			<h1>Trash</h1>
		</Container>
	</Main>
);

export default Trash;