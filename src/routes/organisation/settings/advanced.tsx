import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Header } from '../../../components/Header';
import { Link } from '../../../components/Link';

const OrganisationSettingsAdvanced = inject(app('OrganisationsStore'))(observer((props) => {
	const { match: { params: { orgId } }, OrganisationsStore } = props;
	const organisation = OrganisationsStore.getItem(orgId, '_id');

	return (
		<React.Fragment>
			<Header
				title="Advanced"
				headTitle={`Advanced - ${organisation.name} / Settings`}
				breadcrumbs={[
					<Link key={`/${orgId}`} to={`/${orgId}`}>{organisation.name}</Link>,
					<Link key={`/${orgId}/settings`} to={`/${orgId}/settings`}>Settings</Link>
				]}
			/>
		</React.Fragment>
	);
}));

export default OrganisationSettingsAdvanced;
