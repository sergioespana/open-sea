import React from 'react';
import { Switch } from 'react-router-dom';
import { Redirect } from '../../../components/Redirect';
import { Route } from '../../../components/Route';
import NetworkSettingsAdvanced from './advanced';
import NetworkSettingsDetails from './details';
import NetworkSettingsOrganisations from './organisations';
import NetworkSettingsPeople from './people';

const NetworkSettingsRoutes = (props) => {
	const { match: { params: { netId } } } = props;

	return (
		<Switch>
			<Redirect from={`/${netId}/settings`} exact to={`/${netId}/settings/details`} />
			<Route path="/:netId/settings/advanced" exact component={NetworkSettingsAdvanced} />
			<Route path="/:netId/settings/details" exact component={NetworkSettingsDetails} />
			<Route path="/:netId/settings/organisations" exact component={NetworkSettingsOrganisations} />
			<Route path="/:netId/settings/people" exact component={NetworkSettingsPeople} />
		</Switch>
	);
};

export default NetworkSettingsRoutes;
