import React from 'react';
import { Switch } from 'react-router-dom';
import { Redirect } from '../../../components/Redirect';
import { Route } from '../../../components/Route';
import NetworkSettingsAdvanced from '../../organisation/settings/advanced';
import NetworkSettingsDetails from '../../organisation/settings/details';
import NetworkSettingsPeople from '../../organisation/settings/people';
import NetworkSettingsOrganisations from './organisations';

const NetworkSettingsRoutes = (props) => {
	const { match: { params: { netId } } } = props;

	return (
		<Switch>
			<Redirect from={`/${netId}/settings`} exact to={`/${netId}/settings/details`} />
			<Route path="/:orgId/settings/advanced" exact component={NetworkSettingsAdvanced} />
			<Route path="/:orgId/settings/details" exact component={NetworkSettingsDetails} />
			<Route path="/:netId/settings/organisations" exact component={NetworkSettingsOrganisations} />
			<Route path="/:orgId/settings/people" exact component={NetworkSettingsPeople} />
		</Switch>
	);
};

export default NetworkSettingsRoutes;
