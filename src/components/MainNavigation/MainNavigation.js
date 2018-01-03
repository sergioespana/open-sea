import { inject, observer } from 'mobx-react';
import { matchPath, Route, Switch } from 'react-router-dom';
import Navigation, { NavigationButton, NavigationContainer, NavigationHeader, NavigationMain } from 'components/Navigation';
import { app } from 'mobx-app';
import HelpAndAccount from './HelpAndAccount';
import MainButtons from './MainButtons';
import MdHome from 'react-icons/lib/md/home';
import OrgButtons from './OrgButtons';
import PropsRoute from 'components/PropsRoute';
import React from 'react';
import SearchAndAdd from './SearchAndAdd';

const MainNavigation = inject(app('MVCStore'))(observer(({ curPath, state, MVCStore }) => {
	const { authed, loading, mainNavExpanded: MVCNavExpanded } = state;

	const isAccountRoute = matchPath(curPath, { path: '/account' }) !== null;
	const isCreateRoute = matchPath(curPath, { path: '/create' }) !== null;
	const isDashboardRoute = matchPath(curPath, { path: '/dashboard' }) !== null;
	const isLoginRoute = matchPath(curPath, '/account/(signin|logout|signup)') !== null;
	const isSearchRoute = matchPath(curPath, { path: '/search' }) !== null;
	const organisationMatch = matchPath(curPath, { path: '/:org' }),
		isOrganisationRoute = (organisationMatch && !isAccountRoute && !isCreateRoute && !isDashboardRoute && !isSearchRoute) || false;
	const navExpanded = isCreateRoute || isSearchRoute ? false : (isOrganisationRoute && !authed) ? true : MVCNavExpanded;
	const expandedColour = (isOrganisationRoute || isSearchRoute || isCreateRoute) ? '#f5f5f5' : 'primary';
	const mainColour = !navExpanded ? expandedColour : 'primary';

	if (isLoginRoute) return null;

	return (
		<Navigation
			expanded={navExpanded}
			toggleExpanded={isCreateRoute || isSearchRoute || (isOrganisationRoute && !authed) ? undefined : MVCStore.toggleExpanded}
		>
			<NavigationMain color={mainColour} hidden={isOrganisationRoute && !authed}>
				<NavigationContainer>
					<NavigationHeader center>
						<NavigationButton to="/" round loading={loading} bright><MdHome width={24} height={24} /></NavigationButton>
					</NavigationHeader>
					<Switch>
						<Route path="/(create|search)" />
						<PropsRoute path="*" component={SearchAndAdd} loading={loading} />
					</Switch>
					<Switch>
						<Route path="/(create|search)" />
						{ !navExpanded && <PropsRoute path="/(|account|dashboard)" component={MainButtons} hideTitle loading={loading} /> }
						{ !navExpanded && <PropsRoute path="/:org" component={OrgButtons} loading={loading} /> }
					</Switch>
				</NavigationContainer>
				<Switch>
					<Route path="/(create|search)" />
					<PropsRoute path="*" component={HelpAndAccount} loading={loading} />
				</Switch>
			</NavigationMain>
			<NavigationMain color={expandedColour} hidden={!navExpanded || isCreateRoute || isSearchRoute} width={240}>
				<NavigationContainer fullWidth>
					<Switch>
						<Route path="/(create|search)" />
						{ navExpanded && <PropsRoute path="/(|account|dashboard)" component={MainButtons} loading={loading} /> }
						{ navExpanded && <PropsRoute path="/:org" component={OrgButtons} loading={loading} /> }
					</Switch>
				</NavigationContainer>
			</NavigationMain>
		</Navigation>
	);
}));

export default MainNavigation;