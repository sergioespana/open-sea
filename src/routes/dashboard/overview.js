import { inject, observer } from 'mobx-react';
import React, { Fragment } from 'react';
import { app } from 'mobx-app';
import Container from 'components/Container';
import Header from 'components/Header';
import Helmet from 'react-helmet';
import { Link } from 'components/Link';
import MdLock from 'react-icons/lib/md/lock';
import moment from 'moment';
import Placeholder from 'components/Placeholder';
import reject from 'lodash/reject';
import Table from 'components/Table';

const DashboardOverview = inject(app('state'))(observer((props) => {
	const { state } = props;
	const organisations = reject(state.organisations, ['isNetwork', true]);

	return (
		<Fragment>
			<Helmet>
				<title>dashboard / home</title>
			</Helmet>
			<Header>
				<h1>Dashboard</h1>
			</Header>
			<Container flex>
				<Placeholder>
					<h1>You're all caught up!</h1>
					<p>No organisations require your attention right now.</p>
				</Placeholder>
				<section style={{ flex: '0 0 375px' }}>
					<h1>Organisations</h1>
					<Table
						disableSorting
						defaultSort="-updated"
						data={organisations}
						limit={4}
						columns={[
							{
								key: 'name',
								label: 'Organisation',
								value: ({ name }) => name,
								format: (value, { _id, avatar, name }) => <span><img src={ avatar } /><Link to={ `/${_id}` }>{ name }</Link></span>
							},
							{
								key: 'updated',
								label: 'Last updated',
								value: ({ created, updated }) => updated || created,
								format: (value) => moment().diff(value) > 86400000 ? moment(value).format('DD-MM-YYYY') : moment(value).fromNow(),
								hidden: true
							},
							{
								key: 'isPublic',
								value: ({ isPublic }) => isPublic,
								format: (value) => !value && <MdLock width="1rem" height="1rem" />
							}
						]}
					/>
					<p>
						<span>Recently updated</span>&nbsp;·&nbsp;<Link to="/dashboard/organisations">View all organisations</Link>
					</p>
				</section>
			</Container>
		</Fragment>
	);
}));

export default DashboardOverview;