import Header, { Breadcrumbs } from 'components/Header';
import { inject, observer } from 'mobx-react';
import { app } from 'mobx-app';
import { Link } from 'react-router-dom';
import React from 'react';

const OrganisationDownloads = inject(app('OrganisationsStore'))(observer((props) => {
	const { match: { params: { orgId } }, OrganisationsStore } = props;
	const organisation = OrganisationsStore.getItem(orgId, '_id');

	return (
		<Header>
			<Breadcrumbs>
				<Link to={`/${orgId}`}>{ organisation.name }</Link>
			</Breadcrumbs>
			<h1>Downloads</h1>
		</Header>
	);
}));

export default OrganisationDownloads;