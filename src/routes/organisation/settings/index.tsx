import React from 'react';
import { Switch } from 'react-router-dom';
import { Redirect } from '../../../components/Redirect';
import { Route } from '../../../components/Route';
import OrganisationSettingsAdvanced from './advanced';
import OrganisationSettingsDetails from './details';
import OrganisationSettingsOrganisations from './organisations';
import OrganisationSettingsPeople from './people';

const OrganisationSettingsRoutes = (props) => {
	const { match: { params: { orgId } } } = props;

	return (
		<Switch>
			<Redirect from={`/${orgId}/settings`} exact to={`/${orgId}/settings/details`} />
			<Route path="/:orgId/settings/advanced" exact component={OrganisationSettingsAdvanced} />
			<Route path="/:orgId/settings/details" exact component={OrganisationSettingsDetails} />
			<Route path="/:orgId/settings/organisations" exact component={OrganisationSettingsOrganisations} />
			<Route path="/:orgId/settings/people" exact component={OrganisationSettingsPeople} />
		</Switch>
	);
};

export default OrganisationSettingsRoutes;
