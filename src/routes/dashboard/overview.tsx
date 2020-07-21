import differenceInHours from 'date-fns/difference_in_hours';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import format from 'date-fns/format';
import { reject } from 'lodash';
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

const DashboardOverview = inject(app('state'))(observer((props) => {
	const { state } = props;
	const organisations = reject(state.organisations, { isNetwork: true });

	const PageHead = <Header title="Dashboard" headTitle="dashboard / home" />;

	if (organisations.length === 0) return (
		<React.Fragment>
			{PageHead}
			<Container>
				<EmptyState>
					<img src="/assets/images/empty-state-welcome.svg" />
					<h1>Welcome to openESEA!</h1>
					<p>
						To get started, create an organisation or network below.
					</p>
					<p>
						<LinkButton appearance="default" to="/create/organisation">Create an organisation</LinkButton>
						<LinkButton appearance="link" to="/create/network">Create network instead</LinkButton>
					</p>
				</EmptyState>
			</Container>
		</React.Fragment>
	);

	return (
		<React.Fragment>
			{PageHead}
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
								format: (updated) => differenceInHours(new Date(), updated) > 24 ? format(updated, 'DD-MM-YYYY') : distanceInWordsToNow(updated, { addSuffix: true })
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
