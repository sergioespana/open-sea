import Header, { Breadcrumbs } from 'components/Header';
import { inject, observer } from 'mobx-react';
import React, { Fragment } from 'react';
import { app } from 'mobx-app';
import Container from 'components/Container';
import Helmet from 'react-helmet';
import { Link } from 'components/Link';

const PageHeader = ({ orgId, organisation }) => (
	<Header>
		<Breadcrumbs>
			<Link to={`/${orgId}`}>{ organisation.name }</Link>
			<Link to={`/${orgId}/organisations`}>Organisations</Link>
		</Breadcrumbs>
		<h1>Organisations</h1>
	</Header>
);

const Head = ({ organisation }) => <Helmet title={`${organisation.name} / Organisations`} />;

const NetworkOverview = inject(app('OrganisationsStore'))(observer((props) => {
	const { match: { params: { orgId } }, OrganisationsStore } = props;
	const organisation = OrganisationsStore.getItem(orgId, '_id');
	
	return (
		<Fragment>
			<Head organisation={organisation} />
			<PageHeader orgId={orgId} organisation={organisation} />
			<Container />
		</Fragment>
	);
}));

export default NetworkOverview;