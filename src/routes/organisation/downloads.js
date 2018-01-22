import Header, { Breadcrumbs } from 'components/Header';
import { inject, observer } from 'mobx-react';
import React, { Fragment } from 'react';
import { app } from 'mobx-app';
import Container from 'components/Container';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

const OrganisationDownloads = inject(app('OrganisationsStore'))(observer((props) => {
	const { match: { params: { orgId } }, OrganisationsStore } = props;
	const organisation = OrganisationsStore.getItem(orgId, '_id');

	return (
		<Fragment>
			<Helmet title={`${organisation.name} / Downloads`} />
			<Header>
				<Breadcrumbs>
					<Link to={`/${orgId}`}>{ organisation.name }</Link>
				</Breadcrumbs>
				<h1>Downloads</h1>
			</Header>
			<Container />
		</Fragment>
	);
}));

export default OrganisationDownloads;