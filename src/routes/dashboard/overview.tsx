import { reject } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import MdLock from 'react-icons/lib/md/lock';
import { Container } from '../../components/Container';
import { EmptyState } from '../../components/EmptyState';
import { Header } from '../../components/Header';
import { Link } from '../../components/Link';
import { Section } from '../../components/Section';
import { Table, TableCellWrapper } from '../../components/Table';

const DashboardOverview = inject(app('state'))(observer((props) => {
	const { state } = props;
	const organisations = reject(state.organisations, { isNetwork: true });

	return (
		<React.Fragment>
			<Header title="Dashboard" headTitle="dashboard / home" />
			<Container>
				<Section>
					<EmptyState>
						<img src="/assets/images/empty-state-checklist.svg" />
						<h1>All done!</h1>
						<p>None of your organisations or networks require your attention right now.</p>
					</EmptyState>
				</Section>
				<Section width={375}>
					<h1>Organisations</h1>
					<Table
						columns={[
							{
								key: 'name',
								label: 'Organisation',
								format: (name, { _id, avatar }) => <TableCellWrapper><img src={avatar} /><Link to={`/${_id}`}>{name}</Link></TableCellWrapper>
							},
							{
								label: 'Last updated',
								hidden: true,
								value: ({ created, updated }) => created || updated,
								format: (updated) => moment().diff(updated) > 86400000 ? moment(updated).format('DD-MM-YYYY') : moment(updated).fromNow()
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
						limit={5}
						sortingDisabled
					/>
					<p>Recently updated · <Link to="/dashboard/organisations">View all organisations</Link></p>
				</Section>
			</Container>
		</React.Fragment>
	);
}));

export default DashboardOverview;
