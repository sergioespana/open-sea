import { get } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Button } from '../../../components/Button';
import Container from '../../../components/Container';
import Header from '../../../components/Header';
import { SingleSelect } from '../../../components/Input';
import { Link } from '../../../components/Link';
import { Table, TableCellWrapper } from '../../../components/Table';

const NetworkSettingsPeople = inject(app('AuthStore', 'OrganisationsStore'))(observer((props) => {
	const { AuthStore, match: { params: { netId } }, OrganisationsStore } = props;
	const network = OrganisationsStore.getItem(netId, '_id');
	const users = network._users;

	return (
		<React.Fragment>
			<Header
				title="People"
				headTitle={`People - ${network.name} / Settings`}
				breadcrumbs={[
					<Link key={`/${netId}`} to={`/${netId}`}>{network.name}</Link>,
					<Link key={`/${netId}/settings`} to={`/${netId}/settings`}>Settings</Link>
				]}
			>
				<Button appearance="link">Add user</Button>
			</Header>
			<Container style={{ display: 'block' }}>
				<Table
					columns={[
						{
							label: 'Name',
							value: ({ _id }) => get(AuthStore.getItem(_id, '_id'), 'name'),
							format: (name, { _id }) => {
								const avatar = get(AuthStore.getItem(_id, '_id'), 'avatar');
								return <TableCellWrapper><img src={avatar} /><Link to={`/dashboard/people/${_id}`}>{name}</Link></TableCellWrapper>;
							}
						},
						{
							label: 'Email',
							value: ({ _id }) => get(AuthStore.getItem(_id, '_id'), 'email')
						},
						{
							key: 'access',
							label: 'Role',
							format: (access) => (
								<SingleSelect
									options={[
										{ label: 'Owner', value: 100 },
										{ label: 'Administrator', value: 30 },
										{ label: 'Auditor', value: 20 },
										{ label: 'Viewer', value: 10 }
									]}
									label="Role"
									value={access}
								/>
							)
						},
						{
							key: '',
							label: 'Actions',
							labelHidden: true,
							format: () => <a>Remove</a>
						}
					]}
					data={users}
					defaultSort="-access"
					filters={['access']}
				/>
			</Container>
		</React.Fragment>
	);
}));

export default NetworkSettingsPeople;
