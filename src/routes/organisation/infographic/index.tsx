import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Switch } from 'react-router-dom';
import { Redirect } from '../../../components/Redirect';
import { Route } from '../../../components/Route';
import collection from '../../../stores/collection';
import OrganisationInfographicData from './data';
import OrganisationInfographicSpecification from './Specification';
import OrganisationInfographicOverview from './infographic';
import OrganisationInfographicSettings from './settings';

const OrganisationInfographicRoutes = inject(app('OrganisationsStore'))(observer((props) => {
	const { match: { params: { orgId, infographicId } }, OrganisationsStore } = props;
	const organisation = OrganisationsStore.findById(orgId);

	if (!organisation) return <Redirect to="/dashboard/organisations" />;

	const infographic = collection(organisation._infographics).findById(`${orgId}/${infographicId}`);

	if (!infographic) return <Redirect to={`/${orgId}/infographics`} />;

	return (
		<Switch>
			<Route path="/:orgId/infographics/:infographicId" exact component={OrganisationInfographicOverview} />
			<Route path="/:orgId/infographics/:infographicId/data" exact component={OrganisationInfographicData} />
			<Route path="/:orgId/infographics/:infographicId/specification" exact component={OrganisationInfographicSpecification} />
			<Route path="/:orgId/infographics/:infographicId/settings" exact component={OrganisationInfographicSettings} />
		</Switch>
	);
}));

export default OrganisationInfographicRoutes;
