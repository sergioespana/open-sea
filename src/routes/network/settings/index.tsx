import { inRange } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Switch } from 'react-router-dom';
import { Redirect } from '../../../components/Redirect';
import { Route } from '../../../components/Route';
import { getCurrentUserAccess } from '../../../stores/helpers';
import NetworkSettingsModel from '../../organisation/report/model';
import NetworkSettingsAdvanced from '../../organisation/settings/advanced';
import NetworkSettingsDetails from '../../organisation/settings/details';
import NetworkSettingsPeople from '../../organisation/settings/people';
// import NetworkSettingsModel from './model';
import NetworkSettingsOrganisations from './organisations';

const NetworkSettingsRoutes = inject(app('OrganisationsStore'))(observer((props) => {
	const { match: { params: { netId } }, OrganisationsStore, state } = props;
	const organisation = OrganisationsStore.findById(netId);
	const currentUserAccess = getCurrentUserAccess(state, organisation);

	return (
		<Switch>
			{inRange(currentUserAccess, 30, 101) && <Route path="/:orgId/settings/advanced" exact component={NetworkSettingsAdvanced} />}
			{inRange(currentUserAccess, 30, 101) && <Route path="/:orgId/settings/details" exact component={NetworkSettingsDetails} />}
			{inRange(currentUserAccess, 30, 101) && <Route path="/:orgId/settings/model" exact component={NetworkSettingsModel} />}
			{inRange(currentUserAccess, 30, 101) && <Route path="/:netId/settings/organisations" exact component={NetworkSettingsOrganisations} />}
			<Route path="/:orgId/settings/people" exact component={NetworkSettingsPeople} />
			{inRange(currentUserAccess, 30, 101)
				? <Redirect from="*" exact to={`/${netId}/settings/details`} />
				: <Redirect from="*" exact to={`/${netId}/settings/people`} />
			}
		</Switch>
	);
}));

export default NetworkSettingsRoutes;
