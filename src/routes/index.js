import { inject, observer } from 'mobx-react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Account from 'routes/account';
import Create from 'routes/create';
import CreateDrawer from 'components/CreateDrawer';
import Dashboard from 'routes/dashboard';
import MainNavigation from 'components/MainNavigation';
import Organisation from 'routes/organisation';
import React from 'react';
import SearchDrawer from 'components/SearchDrawer';
import Snackbar from 'components/Snackbar';

const Main = inject('AuthStore', 'MVCStore', 'OrganisationsStore', 'ReportsStore')(observer(({ AuthStore, MVCStore, OrganisationsStore, ReportsStore }) => (
	<React.Fragment>
		<MainNavigation curPath={window.location.pathname} />
		
		{ !AuthStore.loading && !AuthStore.authed ? (
			<Redirect to="/product" replace />
		) : OrganisationsStore.loading || ReportsStore.loading ? (
			<Switch>
				<Route path="/account" component={Account} />
				<Redirect from="/" exact to="/dashboard/overview" replace />
			</Switch>
		) : (
			<Switch>
				<Redirect from="/" exact to="/dashboard/overview" replace />
				<Route path="/account" component={Account} />
				<Route path="/create" component={Create} />
				<Route path="/dashboard" component={Dashboard} />
				<Route path="/search" />
				<Route path="/:org" component={Organisation} />
			</Switch>
		) }

		<SearchDrawer />
		<CreateDrawer />
		<Snackbar />
	</React.Fragment>
)));

export default Main;