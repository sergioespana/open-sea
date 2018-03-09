import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { app } from 'mobx-app';
import Button from 'components/Button';
import filter from 'lodash/filter';
import find from 'lodash/find';
import isUndefined from 'lodash/isUndefined';
import { Link } from 'components/Link';
import linkState from 'linkstate';
import map from 'lodash/map';
import MdDelete from 'react-icons/lib/md/delete';
import moment from 'moment';
import { Select } from 'components/Input';
import Table from 'components/Table';
import trim from 'lodash/trim';

const isBlank = (str) => !trim(str);

@inject(app('OrganisationsStore', 'VisualStore'))
@observer
class OrganisationSettingsOrganisations extends Component {
	state = {
		org: ''
	}

	onSubmit = async (event) => {
		const { org: orgId } = this.state;
		const { match: { params: { orgId: netId } }, OrganisationsStore, VisualStore } = this.props;

		event.preventDefault();
		VisualStore.setBusy(true);

		try { await OrganisationsStore.addOrganisation(netId, orgId); }
		catch (error) { this.handleError(error); }
		finally {
			this.setState({ org: '' });
			VisualStore.setBusy(false);
		}
	}

	onRemoveClick = (orgId) => (event) => {

	}

	handleError = (error) => {
		console.log(error);
	}

	render = () => {
		const { org } = this.state;
		const { match: { params: { orgId: netId } }, OrganisationsStore, state } = this.props;
		const { busy } = state;
		const network = OrganisationsStore.getItem(netId, '_id');
		const shouldPreventSubmit = isBlank(org) || busy;

		return (
			<section>
				<h1>Network organisations</h1>
				<p>
					Keep in mind this is pre-release software. The following limitations exist:
				</p>
				<ul>
					<li>
						openSEA is only capable of adding organisations <strong>that you have access to</strong> to a network.
					</li>
					<li>
						Users added to organisations in this network are <strong>not</strong> automatically given access to all other organisations within the network.
					</li>
					<li>
						Users added to this network are <strong>not</strong> automatically given access to all organisations within the network.
					</li>
				</ul>
				<Table
					columns={[
						{
							key: 'name',
							label: 'Organisation',
							value: ({ _id }) => (OrganisationsStore.getItem(_id, '_id') || {}).name,
							format: (val, { _id }) => {
								const organisation = OrganisationsStore.getItem(_id, '_id') || {};
								return <div><img src={organisation.avatar} /><Link to={`/dashboard/people/${organisation._id}`}>{ organisation.name }</Link></div>;
							}
						},
						{
							key: 'added',
							label: 'Added',
							format: (value) => moment().diff(value) > 86400000 ? moment(value).format('DD-MM-YYYY') : moment(value).fromNow()
						},
						{
							key: '_id',
							label: 'Actions',
							// TODO: Only show this when use has appropriate access
							// TODO: Make this work
							format: (orgId) => (
								<Button
									appearance="subtle"
									onClick={this.onRemoveClick(orgId)}
								><MdDelete width={20} height={20} /></Button>
							)
						}
					]}
					data={network._organisations}
					defaultSort="added"
					footer={[
						<Select
							placeholder="Select an organisation"
							value={org}
							onChange={linkState(this, 'org', 'target.value')}
							disabled={busy}
							colSpan={2}
						>{ map(
								// TODO: Extend filter to also exclude organisations already added
								filter(state.organisations, ({ _id, isNetwork }) => !isNetwork && isUndefined(find(network._organisations, { _id }))),
								({ _id, name }) => <option key={_id} value={_id}>{ name }</option>
							) }</Select>,
						<Button
							appearance="primary"
							busy={busy}
							disabled={shouldPreventSubmit}
							onClick={this.onSubmit}
						>Add</Button>
					]}
				/>
			</section>
		);
	}
}

export default OrganisationSettingsOrganisations;