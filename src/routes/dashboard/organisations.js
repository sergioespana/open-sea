import { inject, observer } from 'mobx-react';
import { app } from 'mobx-app';
import Container from 'components/Container';
import Header from 'components/Header';
import Helmet from 'react-helmet';
import isEmpty from 'lodash/isEmpty';
import keys from 'lodash/keys';
import { Link } from 'react-router-dom';
import Main from 'components/Main';
import map from 'lodash/map';
import MdLock from 'react-icons/lib/md/lock';
import moment from 'moment';
import Placeholder from 'components/Placeholder';
import React from 'react';
import Table from 'components/Table';

const Overview = inject(app('state'))(observer((props) => {
	const { state } = props;
	const { organisations, reports } = state;

	return (
		<Main>
			<Helmet title="home / organisations" />
			<Header title="Organisations" />
			{ isEmpty(organisations) ? (
				<Placeholder>
					<h1>Whoa there!</h1>
					<p>You don't seem to manage any organisations! Why not <Link to="/create/organisation">create one</Link>?</p>
				</Placeholder>
			) : (
				<Container>
					<Table
						columns={[ 'Organisation', 'Network', 'Owner', 'Last updated', 'Reports', '' ]}
						data={map(organisations, (organisation, key) => {
							const { avatar, isPublic, name, _role } = organisation;
							const reportCount = keys(reports[key]).length;
							const updated = organisation.updated ? moment(organisation.updated) : null;

							return [
								<span><img src={avatar || 'https://via.placeholder.com/24x24/00695C'} /><Link to={`/${key}`}>{ name }</Link></span>,
								null,
								_role === 'owner' ? <Link to="/account/profile">You</Link> : null,
								updated ? moment().diff(updated) > 86400000 ? updated.format('DD-MM-YYYY') : updated.fromNow() : 'Never',
								reportCount,
								isPublic ? null : <MdLock width={16} height={16} />
							];
						})}
					/>
				</Container>
			) }
		</Main>
	);
}));

export default Overview;