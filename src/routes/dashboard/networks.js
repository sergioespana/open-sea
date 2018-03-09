import Header, { Section } from 'components/Header';
import { inject, observer } from 'mobx-react';
import React, { Fragment } from 'react';
import { app } from 'mobx-app';
import Button from 'components/Button';
import Container from 'components/Container';
import filter from 'lodash/filter';
import find from 'lodash/find';
import Helmet from 'react-helmet';
import isEmpty from 'lodash/isEmpty';
import { Link } from 'components/Link';
import MdLock from 'react-icons/lib/md/lock';
import moment from 'moment';
import Placeholder from 'components/Placeholder';
import Table from 'components/Table';

const Head = () => (
	<Helmet>
		<title>dashboard / networks</title>
	</Helmet>
);

const DashboardNetworks = inject(app('AuthStore', 'ReportsStore'))(observer((props) => {
	const { AuthStore, state } = props;
	const networks = filter(state.organisations, ['isNetwork', true]);

	if (isEmpty(networks)) return (
		<Fragment>
			<Head />
			<Header>
				<Section>
					<h1>Networks</h1>
				</Section>
			</Header>
			<Container>
				<Placeholder>
					<h1>Whoa there!</h1>
					<p>You don't seem to have access to any networks.</p>
					<p><Button appearance="primary" to="/create/network">Create a network</Button></p>
				</Placeholder>
			</Container>
		</Fragment>
	);

	return (
		<Fragment>
			<Head />
			<Header>
				<h1>Networks</h1>
			</Header>
			<Container>
				<Table
					data={networks}
					defaultSort="-updated"
					columns={[
						{
							key: 'name',
							label: 'Network',
							value: ({ name }) => name,
							// eslint-disable-next-line react/display-name
							format: (value, { _id, avatar, name }) => <div><img src={avatar} /><Link to={`/${_id}`}>{ name }</Link></div>
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
							key: '_organisations',
							label: 'Organisations',
							value: ({ _organisations }) => (_organisations || []).length
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

export default DashboardNetworks;