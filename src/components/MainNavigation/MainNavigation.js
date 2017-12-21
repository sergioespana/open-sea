import { inject, observer } from 'mobx-react';
import { matchPath, Route, Switch } from 'react-router-dom';
import Navigation, { NavigationButton, NavigationContainer, NavigationHeader, NavigationMain } from 'components/Navigation';
import HelpAndAccount from './HelpAndAccount';
import MainButtons from './MainButtons';
import MdHome from 'react-icons/lib/md/home';
import OrgButtons from './OrgButtons';
import PropsRoute from 'components/PropsRoute';
import React from 'react';
import SearchAndAdd from './SearchAndAdd';

const MainNavigation = inject('MVCStore')(observer(({ curPath, MVCStore }) => {
	const isAccountRoute = matchPath(curPath, { path: '/account' }) !== null;
	const isCreateRoute = matchPath(curPath, { path: '/create' }) !== null;
	const isDashboardRoute = matchPath(curPath, { path: '/dashboard' }) !== null;
	const isLoginRoute = matchPath(curPath, '/account/(signin|logout|signup)') !== null;
	const isSearchRoute = matchPath(curPath, { path: '/search' }) !== null;
	const organisationMatch = matchPath(curPath, { path: '/:org' }),
		isOrganisationRoute = (organisationMatch && !isAccountRoute && !isCreateRoute && !isDashboardRoute && !isSearchRoute) || false;
	const navExpanded = MVCStore.navExpanded;
	const mainColour = (isOrganisationRoute && !navExpanded) || isCreateRoute || isSearchRoute ? '#f5f5f5' : 'primary';
	const expandedColour = isOrganisationRoute ? '#f5f5f5' : 'primary';

	if (isLoginRoute) return null;

	return (
		<Navigation
			expanded={isCreateRoute || isSearchRoute ? false : navExpanded}
			toggleExpanded={isCreateRoute || isSearchRoute ? undefined : MVCStore.toggleExpanded}
		>
			<NavigationMain color={mainColour}>
				<NavigationContainer>
					<NavigationHeader center>
						<NavigationButton to="/" round><MdHome width={24} height={24} /></NavigationButton>
					</NavigationHeader>
					<Switch>
						<Route path="/(create|search)" />
						<Route path="*" component={SearchAndAdd} />
					</Switch>
					<Switch>
						<Route path="/(create|search)" />
						{ !navExpanded && <PropsRoute path="/(account|dashboard)" component={MainButtons} hideTitle /> }
						{ !navExpanded && <Route path="/:org" component={OrgButtons} /> }
					</Switch>
				</NavigationContainer>
				<Switch>
					<Route path="/(create|search)" />
					<Route path="*" component={HelpAndAccount} />
				</Switch>
			</NavigationMain>
			<NavigationMain color={expandedColour} hidden={!navExpanded || isCreateRoute || isSearchRoute}>
				<NavigationContainer fullWidth>
					<Switch>
						<Route path="/(create|search)" />
						{ navExpanded && <Route path="/(account|dashboard)" component={MainButtons} /> }
						{ navExpanded && <Route path="/:org" component={OrgButtons} /> }
					</Switch>
				</NavigationContainer>
			</NavigationMain>
		</Navigation>
	);
}));

export default MainNavigation;