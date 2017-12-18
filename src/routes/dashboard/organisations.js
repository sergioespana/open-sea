import { inject, observer } from 'mobx-react';
import Container from 'components/Container';
import Header from 'components/Header';
import { Link } from 'react-router-dom';
import Main from 'components/Main';
import MdLock from 'react-icons/lib/md/lock';
import moment from 'moment';
import React from 'react';
import Table from 'components/Table';

const Overview = inject('OrganisationsStore', 'ReportsStore')(observer(({ OrganisationsStore, ReportsStore }) => (
	<Main>
		<Header title="Organisations" />
		<Container>
			<Table
				columns={[ 'Organisation', 'Network', 'Owner', 'Last updated', 'Reports', '' ]}
				data={Object.keys(OrganisationsStore.findById(null, true)).map((key) => {
					const org = OrganisationsStore.findById(key, true),
						reports = ReportsStore.findById(key),
						updated = org.updated ? moment(org.updated) : null;
					
					return [
						<span><img src={org.avatar || 'https://via.placeholder.com/24x24/00695C'} /><Link to={`/${key}`}>{ org.name }</Link></span>,
						null,
						org.role === 'owner' ? <Link to="/account/profile">You</Link> : null,
						updated ? moment().diff(updated) > 86400000 ? updated.format('DD-MM-YYYY') : updated.fromNow() : 'Never',
						reports ? reports.size : 'Counting...',
						org.public ? null : <MdLock width={16} height={16} />
					];
				})}
				filters={[ 'Owner', 'Network' ]}
			/>
		</Container>
	</Main>
)));

export default Overview;