import { inRange } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Switch } from 'react-router-dom';
import { Redirect } from '../../../components/Redirect';
import { Route } from '../../../components/Route';
import { getCurrentUserAccess } from '../../../stores/helpers';
import OrganisationSettingsAdvanced from './advanced';
import OrganisationSettingsDetails from './details';
import OrganisationSettingsPeople from './people';

const OrganisationSettingsRoutes = inject(app('OrganisationsStore'))(observer((props) => {
	const { match: { params: { orgId } }, OrganisationsStore, state } = props;
	const organisation = OrganisationsStore.findById(orgId);
	const currentUserAccess = getCurrentUserAccess(state, organisation);

	return (
		<Switch>
			{inRange(currentUserAccess, 30, 101) && <Route path="/:orgId/settings/advanced" exact component={OrganisationSettingsAdvanced} />}
			{inRange(currentUserAccess, 30, 101) && <Route path="/:orgId/settings/details" exact component={OrganisationSettingsDetails} />}
			<Route path="/:orgId/settings/people" exact component={OrganisationSettingsPeople} />
			{inRange(currentUserAccess, 30, 101)
				? <Redirect from="" exact to={`/${orgId}/settings/details`} />
				: <Redirect from="" exact to={`/${orgId}/settings/people`} />
			}
		</Switch>
	);
}));

export default OrganisationSettingsRoutes;
