import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { LinkButton } from '../../components/Button';
import Container from '../../components/Container';
import EmptyState from '../../components/EmptyState';
import Header from '../../components/Header';
import { Link } from '../../components/Link';
import { Section } from '../../components/Section';

const NetworkOverview = inject(app('OrganisationsStore'))(observer((props) => {
	const { match: { params: { netId } }, OrganisationsStore } = props;
	const network = OrganisationsStore.findById(netId) || {};
	const organisations = network._organisations;

	const PageHead = (
		<Header
			title="Overview"
			headTitle={network.name}
			breadcrumbs={[
				<Link key={`/${netId}`} to={`/${netId}`}>{network.name}</Link>
			]}
		/>
	);

	if (organisations.length === 0) return (
		<React.Fragment>
			{PageHead}
			<Container>
				<Section>
					<EmptyState>
						<img src="/assets/images/empty-state-welcome.svg" />
						<h1>Let's begin</h1>
						<p>
							To get started using openSEA for your network, add an organisation.
						</p>
						<p>
							<LinkButton appearance="default" to={`/${netId}/settings/organisations`}>Manage organisations</LinkButton>
						</p>
					</EmptyState>
				</Section>
			</Container>
		</React.Fragment>
	);

	return (
		<React.Fragment>
			{PageHead}
			<Container>
				<Section />
			</Container>
		</React.Fragment>
	);
}));

export default NetworkOverview;
