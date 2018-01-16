import { Content, Expander, Group, Header, Inner, Button, Section } from 'components/Navigation';
import { inject, observer } from 'mobx-react';
import React, { Fragment } from 'react';
import { app } from 'mobx-app';
import MdAccountCircle from 'react-icons/lib/md/account-circle';
import MdAdd from 'react-icons/lib/md/add';
import MdBusiness from 'react-icons/lib/md/business';
import MdGroupWork from 'react-icons/lib/md/group-work';
import MdHelp from 'react-icons/lib/md/help';
import MdHome from 'react-icons/lib/md/home';
import MdInbox from 'react-icons/lib/md/inbox';
import MdSearch from 'react-icons/lib/md/search';

const iconProps = { width: 24, height: 24 };
const links = [
	<Button to="/dashboard/overview" key="/dashboard/overview"><MdInbox {...iconProps} />Overview</Button>,
	<Button to="/dashboard/organisations" key="/dashboard/organisations"><MdBusiness {...iconProps} />Organisations</Button>,
	<Button to="/dashboard/networks" key="/dashboard/networks"><MdGroupWork {...iconProps} />Networks</Button>
];

const DashboardNavigation = inject(app('VisualStore'))(observer((props) => {
	const { state, VisualStore } = props;
	const { expanded, loading } = state;

	return (
		<Fragment>
			<Section bg="primary" color="contrast" width={64}>
				<Inner>
					<Content fill>
						<Header loading={loading}>
							<Button to="/" round><MdHome {...iconProps} /></Button>
						</Header>
						<Group loading={loading}>
							<Button round onClick={VisualStore.toggleSearchDrawer}><MdSearch {...iconProps} /></Button>
							<Button round onClick={VisualStore.toggleCreateDrawer}><MdAdd {...iconProps} /></Button>
						</Group>
						<Group hidden={expanded} loading={loading}>{ links }</Group>
					</Content>
					<Content>
						<Group loading={loading}>
							<Button round><MdHelp {...iconProps} /></Button>
							<Button to="/account" round><MdAccountCircle {...iconProps} /></Button>
						</Group>
					</Content>
				</Inner>
			</Section>
			<Section bg="primary" color="contrast" width={240} hidden={!expanded}>
				<Inner>
					<Content fullWidth>
						<Header loading={loading}><h1>openSEA</h1></Header>
						<Group loading={loading}>{ links }</Group>
					</Content>
				</Inner>
			</Section>
			<Expander toggle={VisualStore.toggle} expanded={expanded} />
		</Fragment>
	);
}));

export default DashboardNavigation;