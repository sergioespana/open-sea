import { find, get, reject } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import MdLock from 'react-icons/lib/md/lock';
import { Button } from '../../components/Button';
import { Container } from '../../components/Container';
import { EmptyState } from '../../components/EmptyState';
import { Header } from '../../components/Header';
import { Link } from '../../components/Link';
import { Section } from '../../components/Section';
import { Table, TableCellWrapper } from '../../components/Table';

const DashboardOrganisations = inject(app('state'))(observer((props) => {
	const { state } = props;
	const organisations = reject(state.organisations, { isNetwork: true });

	if (organisations.length === 0) return (
		<React.Fragment>
			<Header title="Organisations" headTitle="dashboard / organisations" />
			<Container>
				<Section>
					<EmptyState>
						<img src="/assets/images/empty-state-welcome.svg" />
						<h1>Welcome to openSEA</h1>
						<p>
							openSEA allows you to easily track progress on metrics and indicators you
							define for your organisation. To get started, simply click below to
							claim your organisation's name.
						</p>
						<p><Button to="/create/organisation">Create an organisation</Button></p>
					</EmptyState>
				</Section>
			</Container>
		</React.Fragment>
	);

	return (
		<React.Fragment>
			<Header title="Organisations" headTitle="dashboard / organisations" />
			<Container>
				<Table
					columns={[
						{
							key: 'name',
							label: 'Organisation',
							format: (name, { _id, avatar }) => <TableCellWrapper><img src={avatar} /><Link to={`/${_id}`}>{name}</Link></TableCellWrapper>
						},
						{
							label: 'Network',
							value: ({ network }) => get(find(state.organisations, { _id: network }), 'name'),
							format: (name, { network: netId }) => {
								if (!name) return null;
								const { _id, avatar } = find(state.organisations, { _id: netId });
								return <TableCellWrapper><img src={avatar} /><Link to={`/${_id}`}>{name}</Link></TableCellWrapper>;
							}
						},
						{
							label: 'Owner',
							value: ({ _users }) => get(find(state.users, { _id: get(find(_users, { access: 100 }), '_id') }), 'name'),
							format: (name, { _users }) => {
								const { _id } = find(state.users, { _id: get(find(_users, { access: 100 }), '_id') });
								return <Link to={`/dashboard/people/${_id}`}>{name}</Link>;
							}
						},
						{
							label: 'Last updated',
							value: ({ created, updated }) => created || updated,
							format: (updated) => moment().diff(updated) > 86400000 ? moment(updated).format('DD-MM-YYYY') : moment(updated).fromNow()
						},
						{
							label: 'Reports',
							value: ({ _reports }) => _reports.length
						},
						{
							key: 'isPublic',
							label: 'Public',
							labelHidden: true,
							format: (isPublic) => !isPublic && <MdLock style={{ height: 14, width: 14 }} />
						}
					]}
					data={organisations}
					defaultSort="-last-updated"
					filters={['network', 'owner', 'public']}
				/>
			</Container>
		</React.Fragment>
	);
}));

export default DashboardOrganisations;
