import Header, { Section } from 'components/Header';
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
import reject from 'lodash/reject';
import Table from 'components/Table';

const Head = () => (
	<Helmet>
		<title>dashboard / organisations</title>
	</Helmet>
);

const DashboardOrganisations = inject(app('AuthStore', 'OrganisationsStore', 'ReportsStore'))(observer((props) => {
	const { AuthStore, OrganisationsStore, ReportsStore, state } = props;
	const organisations = reject(state.organisations, ['isNetwork', true]);

	if (isEmpty(organisations)) return (
		<Fragment>
			<Head />
			<Header>
				<Section>
					<h1>Organisations</h1>
				</Section>
			</Header>
			<Container>
				<Placeholder>
					<h1>Whoa there!</h1>
					<p>You don't seem to have access to any organisations.</p>
					<p><Button appearance="primary" to="/create/organisation">Create an organisation</Button></p>
				</Placeholder>
			</Container>
		</Fragment>
	);

	return (
		<Fragment>
			<Head />
			<Header>
				<h1>Organisations</h1>
			</Header>
			<Container>
				<Table
					data={organisations}
					defaultSort="-updated"
					columns={[
						{
							key: 'name',
							label: 'Organisation',
							value: ({ name }) => name,
							// eslint-disable-next-line react/display-name
							format: (value, { _id, avatar, name }) => <div><img src={avatar} /><Link to={`/${_id}`}>{ name }</Link></div>
						},
						{
							key: 'network',
							label: 'Network',
							value: ({ network }) => (OrganisationsStore.getItem(network, '_id') || {}).name,
							format: (value, { network: netId }) => {
								const network = OrganisationsStore.getItem(netId, '_id') || {};
								return <Link to={`/${netId}`}>{ network.name }</Link>;
							}
						},
						{
							key: 'owner',
							label: 'Owner',
							value: ({ _users }) => {
								const { _uid: ownerId } = find(_users, ({ role }) => role === 'owner');
								const user = AuthStore.getItem(ownerId, '_uid') || {};
								return user.name;
							},
							format: (val, { _users }) => {
								const { _uid: ownerId } = find(_users, ({ role }) => role === 'owner');
								const user = AuthStore.getItem(ownerId, '_uid') || {};
								return <Link to={`/dashboard/people/${user._uid}`}>{ user._isCurrent ? 'You' : user.name }</Link>;
							}
						},
						{
							key: 'updated',
							label: 'Last updated',
							value: ({ created, updated }) => updated || created,
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
							value: ({ isPublic }) => isPublic,
							format: (value) => !value && <MdLock width="1rem" height="1rem" />
						}
					]}
				/>
			</Container>
		</Fragment>
	);
}));

export default DashboardOrganisations;