import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React from 'react';
import Header from '../../../components/Header';
import { Link } from '../../../components/Link';

const NetworkSettingsAdvanced = inject(app('OrganisationsStore'))(observer((props) => {
	const { match: { params: { netId } }, OrganisationsStore } = props;
	const network = OrganisationsStore.getItem(netId, '_id');

	return (
		<React.Fragment>
			<Header
				title="Advanced"
				headTitle={`Advanced - ${network.name} / Settings`}
				breadcrumbs={[
					<Link key={`/${netId}`} to={`/${netId}`}>{network.name}</Link>,
					<Link key={`/${netId}/settings`} to={`/${netId}/settings`}>Settings</Link>
				]}
			/>
		</React.Fragment>
	);
}));

export default NetworkSettingsAdvanced;
