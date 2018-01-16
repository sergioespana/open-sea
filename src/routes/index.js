import { inject, observer } from 'mobx-react';
import { Redirect, Switch } from 'react-router-dom';
import AccountRoutes from './account';
import { app } from 'mobx-app';
import CreateDrawer from 'components/CreateDrawer';
import CreateRoutes from './create';
import DashboardNavigation from 'navigation/dashboard';
import DashboardOverview from './dashboard/overview';
import DashboardRoutes from './dashboard';
import DefaultNavigation from 'navigation';
import Dropzone from 'components/Dropzone';
import Nav from 'components/Navigation';
import OrganisationNavigation from 'navigation/organisation';
import OrganisationRoutes from './organisation';
import React from 'react';
import Route from 'components/Route';
import SearchDrawer from 'components/SearchDrawer';

const Landing = () => <main><DashboardOverview /></main>;

const Navigation = ({ expanded }) => (
	<Nav expanded={expanded}>
		<Switch>
			<Route path="/" exact component={DashboardNavigation} />
			<Route path="/account/(signin|signup|logout)" exact />
			<Route path="/account" component={DashboardNavigation} />
			<Route path="/create" component={DefaultNavigation} />
			<Route path="/dashboard" component={DashboardNavigation} />
			<Route path="/search" component={DefaultNavigation} />
			<Route path="/:orgId" component={OrganisationNavigation} />
			<Route path="*" component={DefaultNavigation} />
		</Switch>
	</Nav>
);

const MainRoutes = inject(app('state'))(observer((props) => {
	const { state } = props;
	const { authed, expanded, listening, loading } = state;

	if (!listening) return null;

	if (loading) return (
		<div id="app">
			<Navigation expanded={expanded} />
			<Switch>
				<Route path="/account" component={AccountRoutes} />
				<Route path="*" />
			</Switch>
		</div>
	);

	return (
		<Dropzone id="app">
			<Navigation expanded={expanded} />
			<CreateDrawer />
			<SearchDrawer />
			<Switch>
				{ !authed && <Redirect from="/" exact to="/product" /> }
				<Route path="/" exact component={Landing} authedOnly />
				<Route path="/account" component={AccountRoutes} />
				<Route path="/create" component={CreateRoutes} authedOnly />
				<Route path="/dashboard" component={DashboardRoutes} authedOnly />
				<Route path="/search" authedOnly />
				<Route path="/:orgId" component={OrganisationRoutes} authedOnly />
			</Switch>
		</Dropzone>
	);
}));

export default MainRoutes;