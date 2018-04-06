import { get } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React from 'react';
import Container from '../../../components/Container';
import Header from '../../../components/Header';
import { Link } from '../../../components/Link';
import { Table, TableCellWrapper } from '../../../components/Table';

const OrganisationSettingsOrganisations = inject(app('OrganisationsStore'))(observer((props) => {
	const { match: { params: { orgId } }, OrganisationsStore } = props;
	const organisation = OrganisationsStore.getItem(orgId, '_id');
	const organisations = organisation._organisations;

	return (
		<React.Fragment>
			<Header
				title="Organisations"
				headTitle={`Organisations - ${organisation.name} / Settings`}
				breadcrumbs={[
					<Link key={`/${orgId}`} to={`/${orgId}`}>{organisation.name}</Link>,
					<Link key={`/${orgId}/settings`} to={`/${orgId}/settings`}>Settings</Link>
				]}
			/>
			<Container style={{ display: 'block' }}>
				<Table
					columns={[
						{
							label: 'Organisation',
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

export default OrganisationSettingsOrganisations;
