import differenceInHours from 'date-fns/difference_in_hours';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import format from 'date-fns/format';
import { filter, find, get } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { MdLock } from 'react-icons/md';
import { LinkButton } from '../../components/Button';
import Container from '../../components/Container';
import EmptyState from '../../components/EmptyState';
import Header from '../../components/Header';
import { Link } from '../../components/Link';
import { Section } from '../../components/Section';
import { Table, TableCellWrapper } from '../../components/Table';

const DashboardNetworks = inject(app('state'))(observer((props) => {
	const { state } = props;
	const networks = filter(state.organisations, { isNetwork: true });

	if (networks.length === 0) return (
		<React.Fragment>
			<Header title="Networks" headTitle="dashboard / networks" />
			<Container>
				<Section>
					<EmptyState>
						<img src="/assets/images/empty-state-welcome.svg" />
						<h1>Welcome to openESEA networks</h1>
						<p>
							Link your organisations by adding them to a network, allowing you
							to easily compare results.
						</p>
						<p><LinkButton appearance="default" to="/create/network">Create a network</LinkButton> <a>Learn more</a></p>
					</EmptyState>
				</Section>
			</Container>
		</React.Fragment>
	);

	return (
		<React.Fragment>
			<Header title="Networks" headTitle="dashboard / networks" />
			<Container>
				<Section>
					<Table
						columns={[
							{
								key: 'name',
								label: 'Networks',
								format: (name, { _id, avatar }) => <TableCellWrapper><img src={avatar} /><Link to={`/${_id}`}>{name}</Link></TableCellWrapper>
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
								value: ({ created, updated }) => updated || created,
								format: (updated) => differenceInHours(new Date(), updated) > 24 ? format(updated, 'DD-MM-YYYY') : distanceInWordsToNow(updated, { addSuffix: true })
							},
							{
								label: 'Organisations',
								value: ({ _organisations }) => _organisations.length
							},
							{
								key: 'isPublic',
								label: 'Public',
								labelHidden: true,
								format: (isPublic) => !isPublic && <MdLock style={{ height: 14, width: 14 }} />
							}
						]}
						data={networks}
						defaultSort="-last-updated"
						filters={['owner', 'public']}
					/>
				</Section>
			</Container>
		</React.Fragment>
	);
}));

export default DashboardNetworks;
