import { h } from 'preact';
import { Link } from 'react-router-dom';
import map from 'lodash/map';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import Container from '../components/Container';
import Main from '../components/Main';

const Home = (props, { mobxStores: { OrgStore, DialogStore } }) => (
	<Main>
		<Container>
			<p>Your organisations</p>
			<ul>
				{ map(toJS(OrgStore.organisations), (org, id) => (
					<li>
						<Link to={`/organisation/${id}`}>{org.name}</Link>
					</li>
				)) }
			</ul>
		</Container>
	</Main>
);

export default observer(Home);