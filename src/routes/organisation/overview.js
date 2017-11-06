import { h } from 'preact';
import Container from '../../components/Container';

const Overview = ({ match: { params: { id } } }, { mobxStores: { OrgStore } }) => {
	let organisation = OrgStore.organisations.get(id);

	return (
		<Container>
			<h1>Overview</h1>
		</Container>
	);
};

export default Overview;