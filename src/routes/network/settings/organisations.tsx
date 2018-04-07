import { get } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Button } from '../../../components/Button';
import Container from '../../../components/Container';
import Header from '../../../components/Header';
import { Link } from '../../../components/Link';
import { Table, TableCellWrapper } from '../../../components/Table';

const NetworkSettingsOrganisations = inject(app('OrganisationsStore'))(observer((props) => {
	const { match: { params: { netId } }, OrganisationsStore } = props;
	const network = OrganisationsStore.getItem(netId, '_id');
	const organisations = network._organisations;

	return (
		<React.Fragment>
			<Header
				title="Organisations"
				headTitle={`Organisations - ${network.name} / Settings`}
				breadcrumbs={[
					<Link key={`/${netId}`} to={`/${netId}`}>{network.name}</Link>,
					<Link key={`/${netId}/settings`} to={`/${netId}/settings`}>Settings</Link>
				]}
			>
				<Button appearance="link">Add network</Button>
			</Header>
			<Container style={{ display: 'block' }}>
				<Table
					columns={[
						{
							label: 'Network',
							value: ({ _id }) => get(OrganisationsStore.getItem(_id, '_id'), 'name'),
							format: (name, { _id }) => {
								const avatar = get(OrganisationsStore.getItem(_id, '_id'), 'avatar');
								return <TableCellWrapper><img src={avatar} /><Link to={`/${_id}`}>{name}</Link></TableCellWrapper>;
							}
						},
						{
							key: '',
							label: 'Actions',
							labelHidden: true,
							format: () => <a>Remove</a>
						}
					]}
					data={organisations}
				/>
			</Container>
		</React.Fragment>
	);
}));

export default NetworkSettingsOrganisations;
