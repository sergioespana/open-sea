import { h } from 'preact';
import Main from '../../components/Main';
import { observer } from 'mobx-react';
import Container from '../../components/Container';

const Settings = ({ match: { params: { id } } }, { mobxStores: { OrgStore, AuthStore, DialogStore } }) => (
	<Main bg="#eee">
		<Container slim>
			<h1>Settings</h1>
		</Container>
	</Main>
);

export default observer(Settings);