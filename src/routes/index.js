import { h } from 'preact';
import map from 'lodash/map';
import capitalize from 'lodash/capitalize'
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import Container from '../components/Container';
import Main from '../components/Main';
import Hero from '../components/Hero';
import ImageCard from '../components/ImageCard';
import Grid from '../components/Grid';
import Avatar from '../components/Avatar';

import PlusIcon from 'react-material-icon-svg/dist/PlusIcon';

const Home = (props, { mobxStores: { OrgStore, DialogStore } }) => (
	<Main>
		<Hero />
		<Container>
			<p>Your organisations</p>
			<Grid gutter={25} childMinWidth={200}>
				<ImageCard
					primary="Create new organisation"
					icon={<PlusIcon />}
					onClick={() => DialogStore.show('Create an organisation', 'TODO', [
						{ message: 'Cancel' },
						{ message: 'Create' }
					])}
				/>
				{ map(toJS(OrgStore.organisations), (org, id) => (
					<ImageCard
						primary={org.name}
						secondary={`${id} · ${capitalize(org._role)}`}
						to={`/organisation/${id}`}
						src={org.avatar}
						icon={<Avatar>{ org.name }</Avatar>}
					/>
				)) }
			</Grid>
		</Container>
	</Main>
);

export default observer(Home);