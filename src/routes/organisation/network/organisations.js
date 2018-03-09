import Header, { Breadcrumbs, Section } from 'components/Header';
import { inject, observer } from 'mobx-react';
import React, { Fragment } from 'react';
import { app } from 'mobx-app';
import Button from 'components/Button';
import Container from 'components/Container';
import find from 'lodash/find';
import Helmet from 'react-helmet';
import isEmpty from 'lodash/isEmpty';
import { Link } from 'components/Link';
import MdLock from 'react-icons/lib/md/lock';
import moment from 'moment';
import Placeholder from 'components/Placeholder';
import Table from 'components/Table';

const PageHeader = ({ orgId, network }) => (
	<Header>
		<Section>
			<Breadcrumbs>
				<Link to={`/${orgId}`}>{ network.name }</Link>
			</Breadcrumbs>
			<h1>Organisations</h1>
		</Section>
	</Header>
);

const Head = ({ network }) => <Helmet title={`${network.name} / Organisations`} />;

const NetworkOverview = inject(app('AuthStore', 'OrganisationsStore', 'ReportsStore'))(observer((props) => {
	const { AuthStore, match: { params: { orgId } }, OrganisationsStore, ReportsStore } = props;
	const network = OrganisationsStore.getItem(orgId, '_id');
	const organisations = network._organisations || [];

	if (isEmpty(organisations)) return (
		<Fragment>
			<Head network={network} />
			<PageHeader orgId={orgId} network={network} />
			<Container>
				<Placeholder>
					<h1>No member organisations</h1>
					<p>To get started, add an organisation to this network.</p>
					<p><Button appearance="primary" to={`/${orgId}/settings/organisations`}>Manage organisations</Button></p>
				</Placeholder>
			</Container>
		</Fragment>
	);
	
	return (
		<Fragment>
			<Head network={network} />
			<PageHeader orgId={orgId} network={network} />
			<Container>
				<Table
					columns={[
						{
							key: 'name',
							label: 'Organisation',
							value: ({ _id }) => (OrganisationsStore.getItem(_id, '_id') || {}).name,
							// eslint-disable-next-line react/display-name
							format: (value, { _id }) => {
								const { avatar, name } = OrganisationsStore.getItem(_id, '_id') || {};
								return <div><img src={avatar} /><Link to={`/${_id}`}>{ name }</Link></div>;
							}
						},
						{
							key: 'owner',
							label: 'Owner',
							value: ({ _id }) => {
								const { _users } = OrganisationsStore.getItem(_id, '_id') || {};
								const { _uid: ownerId } = find(_users, ({ role }) => role === 'owner');
								const user = AuthStore.getItem(ownerId, '_uid') || {};
								return user.name;
							},
							format: (value, { _id }) => {
								const { _users } = OrganisationsStore.getItem(_id, '_id') || {};
								const { _uid: ownerId } = find(_users, ({ role }) => role === 'owner');
								const user = AuthStore.getItem(ownerId, '_uid') || {};
								return <Link to={`/dashboard/people/${user._uid}`}>{ user._isCurrent ? 'You' : user.name }</Link>;
							}
						},
						{
							key: 'added',
							label: 'Added',
							format: (value) => moment().diff(value) > 86400000 ? moment(value).format('DD-MM-YYYY') : moment(value).fromNow()
						},
						{
							key: '_reports',
							label: 'Reports',
							value: ({ _id: _orgId }) => ReportsStore.getItems({ _orgId }).length
						},
						{
							key: 'isPublic',
							label: 'Public',
							labelHidden: true,
							value: ({ _id }) => (OrganisationsStore.getItem(_id, '_id') || {}).isPublic,
							format: (value) => !value && <MdLock width="1rem" height="1rem" />
						}
					]}
					data={organisations}
					defaultSort="-added"
				/>
			</Container>
		</Fragment>
	);
}));

export default NetworkOverview;