import Fuse from 'fuse.js';
import linkState from 'linkstate';
import { filter, flattenDeep, inRange, map, reject } from 'lodash';
import { toJS } from 'mobx';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import MdAccountCircle from 'react-icons/lib/md/account-circle';
import MdAdd from 'react-icons/lib/md/add';
import MdAssessment from 'react-icons/lib/md/assessment';
import MdBusiness from 'react-icons/lib/md/business';
import MdCompareArrows from 'react-icons/lib/md/compare-arrows';
import MdGroupWork from 'react-icons/lib/md/group-work';
import MdHelp from 'react-icons/lib/md/help';
import MdHome from 'react-icons/lib/md/home';
import MdInbox from 'react-icons/lib/md/inbox';
import MdPeople from 'react-icons/lib/md/people';
import MdSearch from 'react-icons/lib/md/search';
import MdSettings from 'react-icons/lib/md/settings';
import { Switch } from 'react-router-dom';
import Button from '../components/Button';
import Drawer, { Button as DrawerButton, SearchInput } from '../components/Drawer';
import Flag, { FlagGroup } from '../components/Flag';
import Lozenge from '../components/Lozenge';
import { Menu, MenuOption } from '../components/Menu';
import Modal, { ModalFooter, ModalHeader, ModalSection } from '../components/Modal';
import { Button as NavButton, Navigation } from '../components/Navigation';
import { Redirect } from '../components/Redirect';
import { Route } from '../components/Route';
import { getCurrentUser, getCurrentUserAccess } from '../stores/helpers';
import AccountRoutes from './account/index';
import CreateRoutes from './create/index';
import DashboardRoutes from './dashboard';
import DashboardOverview from './dashboard/overview';
import OrganisationRoutes from './organisation';

@inject(app('UIStore'))
@observer
class SearchDrawer extends Component<any> {
	readonly state = {
		query: ''
	};

	render () {
		const { state, UIStore } = this.props;
		const { query } = this.state;
		const { isSearchDrawerOpen } = state;

		const reports = (new Fuse(flattenDeep(map(filter(toJS(state.organisations), ({ _reports }) => _reports.length > 0), ({ _reports }) => _reports)), { keys: ['name'] })).search(query);
		const organisations = (new Fuse(reject(state.organisations, { isNetwork: true }), { keys: ['name'] })).search(query);
		const networks = (new Fuse(filter(state.organisations, { isNetwork: true }), { keys: ['name'] })).search(query);
		const users = (new Fuse(state.users, { keys: ['name'] })).search(query);

		return (
			<Drawer
				closeIconPosition="top"
				isOpen={isSearchDrawerOpen}
				mainIcon={<MdHome />}
				onClose={UIStore.toggleSearchDrawerOpen}
				width={550}
			>
				<form style={{ width: '100%' }}>
					<SearchInput
						autoFocus
						onChange={linkState(this, 'query')}
						placeholder="Search for organisations, reports, and more..."
						value={query}
					/>
				</form>
				{reports.length > 0 && <h3>Reports</h3>}
				{reports.length > 0 && map(reports, ({ _id, name }) => <DrawerButton to={`/${_id}`}>{name}</DrawerButton>)}
				{organisations.length > 0 && <h3>Organisations</h3>}
				{organisations.length > 0 && map(organisations, ({ _id, avatar, name }) => <DrawerButton to={`/${_id}`}><img src={avatar} />{name}</DrawerButton>)}
				{networks.length > 0 && <h3>Networks</h3>}
				{networks.length > 0 && map(networks, ({ _id, avatar, name }) => <DrawerButton to={`/${_id}`}><img src={avatar} />{name}</DrawerButton>)}
				{users.length > 0 && <h3>Users</h3>}
				{users.length > 0 && map(users, ({ _id, avatar, name }) => <DrawerButton to={`/${_id}`}><img src={avatar} />{name}</DrawerButton>)}
			</Drawer>
		);
	}
}

const Routes = inject(app('UIStore'))(observer((props) => {
	const { state, UIStore } = props;
	const { flags, isAuthed, isCreateDrawerOpen, isKSModalOpen, isLoading, isReady } = state;

	// We render different navigation components on different routes.
	// Too many variables change for us to do this within a single
	// component. Performance is still very much acceptable doing it
	// this way, so this is fine for now.
	const MainNavigation = (
		<Switch>
			<Route path="/" exact component={DashboardNavigation} />
			<Route path="/dashboard" component={DashboardNavigation} />
			<Route path="/account" />
			<Route path="/create" component={DefaultNavigation} />
			<Route path="/:orgId" component={OrganisationNavigation} />
			<Route path="*" component={DefaultNavigation} />
		</Switch>
	);

	// Prepare the component making up the global create drawer.
	const CreateDrawer = (
		<Drawer
			closeIconPosition="bottom"
			isOpen={isCreateDrawerOpen}
			mainIcon={<MdHome />}
			onClose={UIStore.toggleCreateDrawerOpen}
			width={356}
		>
			<DrawerButton to="/create/report"><MdAssessment />Report</DrawerButton>
			<DrawerButton to="/create/organisation"><MdBusiness />Organisation</DrawerButton>
			<DrawerButton to="/create/network"><MdGroupWork />Network</DrawerButton>
		</Drawer>
	);

	// Prepare the component making up the global keyboard shortcut modal.
	// TODO: Revisit this for styling.
	const KSModal = (
		<Modal isOpen={isKSModalOpen} onClose={UIStore.toggleKSModalOpen}>
			<ModalHeader>
				<h1>Keyboard shortcuts</h1>
			</ModalHeader>
			<ModalSection>
				<h3>Global actions</h3>
				<ul>
					<li>Expand and collapse navigation <Lozenge appearance="default">[</Lozenge></li>
					<li>Focus the site search <Lozenge appearance="default">/</Lozenge></li>
					<li>Create a report <Lozenge appearance="default">C</Lozenge> then <Lozenge appearance="default">R</Lozenge></li>
					<li>Create an organisation <Lozenge appearance="default">C</Lozenge> then <Lozenge appearance="default">O</Lozenge></li>
					<li>Create a network <Lozenge appearance="default">C</Lozenge> then <Lozenge appearance="default">N</Lozenge></li>
				</ul>
				<h3>Application</h3>
				<ul>
					<li>Dismiss dialog <Lozenge appearance="default">ESC</Lozenge></li>
					<li>Display this help <Lozenge appearance="default">?</Lozenge></li>
				</ul>
				<h3>Global navigation</h3>
				<ul>
					<li>Go to dashboard <Lozenge appearance="default">G</Lozenge> then <Lozenge appearance="default">D</Lozenge></li>
					<li>Go to organisations <Lozenge appearance="default">G</Lozenge> then <Lozenge appearance="default">O</Lozenge></li>
					<li>Go to network <Lozenge appearance="default">G</Lozenge> then <Lozenge appearance="default">N</Lozenge></li>
					<li>Go to people <Lozenge appearance="default">G</Lozenge> then <Lozenge appearance="default">P</Lozenge></li>
				</ul>
			</ModalSection>
			<ModalFooter>
				<Button appearance="default" onClick={UIStore.toggleKSModalOpen}>Close</Button>
			</ModalFooter>
		</Modal>
	);

	const Flags = (
		<FlagGroup>
			{map(flags, (flag, i) => <Flag {...flag} onDismiss={UIStore.removeFlag(i)} />)}
		</FlagGroup>
	);

	// Show an empty screen if we don't know whether the user is
	// authenticated or not.
	if (!isReady) return null;

	// When loading, show only the main navigation (but in loading state).
	if (isLoading) return <div id="app">{MainNavigation}</div>;

	// Otherwise, full application is made available to user. Props "authedOnly" and
	// "unauthedOnly" will redirect the user if he's trying to visit a page
	// he's not allowed to see given his current auth status.
	return (
		<div id="app">
			{MainNavigation}
			<main>
				<Switch>
					{!isAuthed && <Redirect from="/" to="/product" exact />}
					<Route path="/" exact authedOnly component={DashboardOverview} />
					<Route path="/account" component={AccountRoutes} />
					<Route path="/create" authedOnly component={CreateRoutes} />
					<Route path="/dashboard" authedOnly component={DashboardRoutes} />
					<Route path="/:orgId" component={OrganisationRoutes} />
				</Switch>
			</main>
			<SearchDrawer />
			{CreateDrawer}
			{KSModal}
			{Flags}
		</div>
	);
}));

// Navigation components are below. We'll probably move these to separate files at some point,
// but for now this is slightly more convenient.

const DefaultNavigation = inject(app('state'))(observer((props) => {
	const { state } = props;
	const { isLoading } = state;

	return (
		<Navigation
			appearance="light"
			loading={isLoading}
			mainIcon={<MdHome />}
			mainIconHref="/"
		/>
	);
}));

const DashboardNavigation = inject(app('UIStore'))(observer((props) => {
	const { state, UIStore } = props;
	const { isLoading, isNavExpanded } = state;
	const curUser = getCurrentUser(state) || {}; // FIXME: Somehow return a Maybe or something.

	return (
		<Navigation
			appearance="default"
			createIcon={<MdAdd />}
			createIconAction={UIStore.toggleCreateDrawerOpen}
			expandable
			expanded={isNavExpanded}
			expandedAppearance="default"
			footerItems={[
				{
					element: (
						<Menu
							position="bottom-right"
							trigger={<NavButton round><MdHelp /></NavButton>}
						>
							<h3>Help</h3>
							<MenuOption>openSEA documentation</MenuOption>
							<MenuOption>What's new</MenuOption>
							<MenuOption onClick={UIStore.toggleKSModalOpen}>Keyboard shortcuts</MenuOption>
							<MenuOption>About openSEA</MenuOption>
							<h3>Legal</h3>
							<MenuOption>Terms of Use</MenuOption>
							<MenuOption>Privacy Policy</MenuOption>
						</Menu>
					)
				},
				{
					element: (
						<Menu
							position="bottom-right"
							trigger={<NavButton round>{isLoading ? <MdAccountCircle /> : <img src={curUser.avatar} />}</NavButton>}
						>
							<h3>Your openSEA</h3>
							<MenuOption to={`/dashboard/people/${curUser._id}`}>Profile</MenuOption>
							<MenuOption>Give feedback</MenuOption>
							<MenuOption to="/account/signout">Log out</MenuOption>
						</Menu>
					)
				}
			]}
			loading={isLoading}
			mainIcon={<MdHome />}
			mainIconHref="/"
			navigationItems={[
				{
					isHeader: true,
					label: 'openSEA'
				},
				{
					icon: <MdInbox />,
					label: 'Overview',
					to: '/dashboard/overview'
				},
				{
					icon: <MdBusiness />,
					label: 'Organisations',
					to: '/dashboard/organisations'
				},
				{
					icon: <MdGroupWork />,
					label: 'Networks',
					to: '/dashboard/networks'
				},
				{
					icon: <MdPeople />,
					label: 'People',
					to: '/dashboard/people'
				}
			]}
			searchIcon={<MdSearch />}
			searchIconAction={UIStore.toggleSearchDrawerOpen}
			toggleExpanded={UIStore.toggleNavExpanded}
		/>
	);
}));

const OrganisationNavigation = inject(app('OrganisationsStore', 'UIStore'))(observer((props) => {
	const { match: { params: { orgId } }, OrganisationsStore, state, UIStore } = props;
	const { isLoading, isNavExpanded } = state;
	const organisation = OrganisationsStore.findById(orgId) || {};
	const curUser = getCurrentUser(state) || {};
	const currentUserAccess = getCurrentUserAccess(state, organisation);

	const organisationItems = [
		{
			icon: <img src={organisation.avatar} />,
			isHeader: true,
			label: organisation.name,
			to: `/${orgId}`
		},
		{
			icon: <MdInbox />,
			label: 'Overview',
			to: `/${orgId}/overview`
		},
		{
			icon: <MdAssessment />,
			label: 'Reports',
			to: `/${orgId}/reports`
		},
		{
			icon: <MdSettings />,
			label: 'Settings',
			to: `/${orgId}/settings`,
			navigationItems: [
				{
					hidden: !inRange(currentUserAccess, 30, 101),
					label: 'Details',
					to: `/${orgId}/settings/details`
				},
				{
					label: 'People',
					to: `/${orgId}/settings/people`
				},
				{
					hidden: !inRange(currentUserAccess, 30, 101),
					label: 'Advanced',
					to: `/${orgId}/settings/advanced`
				}
			]
		}
	];
	const networkItems = [
		{
			icon: <img src={organisation.avatar} />,
			isHeader: true,
			label: organisation.name,
			to: `/${orgId}`
		},
		{
			icon: <MdInbox />,
			label: 'Overview',
			to: `/${orgId}/overview`
		},
		{
			icon: <MdCompareArrows />,
			label: 'Compare',
			to: `/${orgId}/compare`
		},
		{
			icon: <MdSettings />,
			label: 'Settings',
			to: `/${orgId}/settings`,
			navigationItems: [
				{
					hidden: !inRange(currentUserAccess, 30, 101),
					label: 'Details',
					to: `/${orgId}/settings/details`
				},
				{
					label: 'People',
					to: `/${orgId}/settings/people`
				},
				{
					hidden: !inRange(currentUserAccess, 30, 101),
					label: 'Organisations',
					to: `/${orgId}/settings/organisations`
				},
				{
					hidden: !inRange(currentUserAccess, 30, 101),
					label: 'Advanced',
					to: `/${orgId}/settings/advanced`
				}
			]
		}
	];

	return (
		<Navigation
			appearance="default"
			createIcon={<MdAdd />}
			createIconAction={UIStore.toggleCreateDrawerOpen}
			expandable
			expanded={isNavExpanded}
			expandedAppearance="light"
			footerItems={[
				{
					element: (
						<Menu
							position="bottom-right"
							trigger={(
								<NavButton
									appearance={isNavExpanded ? 'default' : 'light'}
									round
								>
									<MdHelp />
								</NavButton>
							)}
						>
							<h3>Help</h3>
							<MenuOption>openSEA documentation</MenuOption>
							<MenuOption>What's new</MenuOption>
							<MenuOption onClick={UIStore.toggleKSModalOpen}>Keyboard shortcuts</MenuOption>
							<MenuOption>About openSEA</MenuOption>
							<h3>Legal</h3>
							<MenuOption>Terms of Use</MenuOption>
							<MenuOption>Privacy Policy</MenuOption>
						</Menu>
					)
				},
				{
					element: (
						<Menu
							position="bottom-right"
							trigger={(
								<NavButton
									appearance={isNavExpanded ? 'default' : 'light'}
									round
								>
									{isLoading ? <MdAccountCircle /> : <img src={curUser.avatar} />}
								</NavButton>
							)}
						>
							<h3>Your openSEA</h3>
							<MenuOption to={`/dashboard/people/${curUser._id}`}>Profile</MenuOption>
							<MenuOption>Give feedback</MenuOption>
							<MenuOption to="/account/signout">Log out</MenuOption>
						</Menu>
					)
				}
			]}
			loading={isLoading}
			mainIcon={<MdHome />}
			mainIconHref="/"
			navigationItems={organisation.isNetwork ? networkItems : organisationItems}
			searchIcon={<MdSearch />}
			searchIconAction={UIStore.toggleSearchDrawerOpen}
			toggleExpanded={UIStore.toggleNavExpanded}
		/>
	);
}));

export default Routes;
