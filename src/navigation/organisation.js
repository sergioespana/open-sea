import { Content, Expander, Group, Header, Inner, Button, Section } from 'components/Navigation';
import { inject, observer } from 'mobx-react';
import React, { Fragment } from 'react';
import { app } from 'mobx-app';
import MdAccountCircle from 'react-icons/lib/md/account-circle';
import MdAdd from 'react-icons/lib/md/add';
import MdAssessment from 'react-icons/lib/md/assessment';
import MdFileDownload from 'react-icons/lib/md/file-download';
import MdHelp from 'react-icons/lib/md/help';
import MdHome from 'react-icons/lib/md/home';
import MdInbox from 'react-icons/lib/md/inbox';
import MdSearch from 'react-icons/lib/md/search';
import MdSettings from 'react-icons/lib/md/settings';

const iconProps = { width: 24, height: 24 };
const links = (orgId) => [
	<Button to={`/${orgId}/overview`} key={`/${orgId}/overview`}><MdInbox {...iconProps} />Overview</Button>,
	<Button to={`/${orgId}/reports`} key={`/${orgId}/reports`}><MdAssessment {...iconProps} />Reports</Button>,
	<Button to={`/${orgId}/downloads`} key={`/${orgId}/downloads`}><MdFileDownload {...iconProps} />Downloads</Button>,
	<Button to={`/${orgId}/settings`} key={`/${orgId}/settings`}><MdSettings {...iconProps} />Settings</Button>
];

const OrganisationNavigation = inject(app('OrganisationsStore', 'VisualStore'))(observer((props) => {
	const { match, OrganisationsStore, state, VisualStore } = props;
	const { params: { orgId } } = match;
	const { expanded, loading } = state;
	const organisation = OrganisationsStore.getItem(orgId, '_id') || {};

	return (
		<Fragment>
			<Section bg={expanded ? 'primary' : 'light'} color={expanded ? 'contrast' : 'primary'} width={64}>
				<Inner>
					<Content fill>
						<Header loading={loading}>
							<Button to="/" round><MdHome {...iconProps} /></Button>
						</Header>
						<Group loading={loading}>
							<Button round onClick={VisualStore.toggleSearchDrawer}><MdSearch {...iconProps} /></Button>
							<Button round onClick={VisualStore.toggleCreateDrawer}><MdAdd {...iconProps} /></Button>
						</Group>
						<Header hidden={expanded} loading={loading}>
							<Button to={`/${orgId}`} large><img src={organisation.avatar} />{ organisation.name }</Button>
						</Header>
						<Group hidden={expanded} loading={loading}>{ links(orgId) }</Group>
					</Content>
					<Content>
						<Group loading={loading}>
							<Button round><MdHelp {...iconProps} /></Button>
							<Button to="/account" round><MdAccountCircle {...iconProps} /></Button>
						</Group>
					</Content>
				</Inner>
			</Section>
			<Section bg="light" color="primary" width={240} hidden={!expanded}>
				<Inner>
					<Content fullWidth>
						<Header loading={loading}>
							<Button to={`/${orgId}`} large><img src={organisation.avatar} />{ organisation.name }</Button>
						</Header>
						<Group loading={loading}>{ links(orgId) }</Group>
					</Content>
				</Inner>
			</Section>
			<Expander toggle={VisualStore.toggle} expanded={expanded} />
		</Fragment>
	);
}));

export default OrganisationNavigation;