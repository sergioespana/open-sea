import differenceInHours from 'date-fns/difference_in_hours';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import format from 'date-fns/format';
import { filter, find, get, isUndefined, reject } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React from 'react';
import MdLock from 'react-icons/lib/md/lock';
import { LinkButton } from '../../components/Button';
import Container from '../../components/Container';
import EmptyState from '../../components/EmptyState';
import Header from '../../components/Header';
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
						<p><LinkButton appearance="default" to="/create/organisation">Create an organisation</LinkButton></p>
					</EmptyState>
				</Section>
			</Container>
		</React.Fragment>
	);

	return (
		<React.Fragment>
			<Header title="Organisations" headTitle="dashboard / organisations" />
			<Container>
				<Section>
					<Table
						columns={[
							{
								key: 'name',
								label: 'Organisation',
								format: (name, { _id, avatar }) => <TableCellWrapper><img src={avatar} /><Link to={`/${_id}`}>{name}</Link></TableCellWrapper>
							},
							{
								label: 'Network',
								value: ({ _id }) => {
									const allNetworks = filter(state.organisations, { isNetwork: true });
									const networks = filter(allNetworks, ({ _organisations }) => !isUndefined(find(_organisations, { _id })));
									return get(networks, '[0].name');
								},
								format: (name, { _id }) => {
									if (!name) return null;
									const allNetworks = filter(state.organisations, { isNetwork: true });
									const { _id: netId, avatar } = filter(allNetworks, ({ _organisations }) => !isUndefined(find(_organisations, { _id })))[0];
									return <TableCellWrapper><img src={avatar} /><Link to={`/${netId}`}>{name}</Link></TableCellWrapper>;
								}
							},
							{
								label: 'Owner',
								value: ({ _users }) => get(find(state.users, { _id: get(find(_users, { access: 100 }), '_id') }), 'name'),
								format: (name, { _users }) => {
									const id = get(find(state.users, { _id: get(find(_users, { access: 100 }), '_id') }), '_id');
									return <Link to={`/dashboard/people/${id}`}>{name}</Link>;
								}
							},
							{
								label: 'Last updated',
								value: ({ created, updated }) => updated || created,
								format: (updated) => differenceInHours(new Date(), updated) > 24 ? format(updated, 'DD-MM-YYYY') : distanceInWordsToNow(updated, { addSuffix: true })
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
				</Section>
			</Container>
		</React.Fragment>
	);
}));

export default DashboardOrganisations;
