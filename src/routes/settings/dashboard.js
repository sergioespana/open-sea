import { h } from 'preact';
import { observer } from 'mobx-react';
import Container from '../../components/Container';

const Dashboard = (props, { mobxStores: { AuthStore } }) => (
	<Container slim>
		todo
	</Container>
);

export default observer(Dashboard);