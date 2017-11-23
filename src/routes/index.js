import Card, { CardTitle } from 'material-styled-components/Card';
import { inject, observer } from 'mobx-react';
import CenterProgress from 'components/CenterProgress';
import Container from 'components/Container';
import Grid from 'components/Grid';
import Hero from 'components/Hero';
import { Link } from 'react-router-dom';
import Main from 'components/Main';
import React from 'react';

const Home = inject('OrganisationsStore', 'SnackbarStore')(observer(({ OrganisationsStore, SnackbarStore }) => OrganisationsStore.loading ? (
	<CenterProgress />
) : (
	<Main bg="#eee">
		<Hero />
		<Container medium>
			<Grid gutter={24}>
				<Card>
					<Link to="/new">
						<CardTitle primary="Create new" />
					</Link>
				</Card>
				{ Object.keys(OrganisationsStore.findById(null, true)).map((key) => {
					const org = OrganisationsStore.findById(key, true);
					return (
						<Card key={key}>
							<Link to={`/${key}`}>
								<CardTitle primary={org.name} secondary={org.role} />
							</Link>
						</Card>
					);
				}) }
			</Grid>
		</Container>
	</Main>
)));

export default Home;