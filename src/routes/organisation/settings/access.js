import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { Select, TextField } from 'components/Input';
import { app } from 'mobx-app';
import Button from 'components/Button';
import Error from '@atlaskit/icon/glyph/error';
import { Link } from 'components/Link';
import linkState from 'linkstate';
import MdDelete from 'react-icons/lib/md/delete';
import moment from 'moment';
import Table from 'components/Table';
import trim from 'lodash/trim';

const isBlank = (str) => !trim(str);

@inject(app('AuthStore', 'OrganisationsStore', 'VisualStore'))
@observer
class OrganisationSettingsAccess extends Component {
	state = {
		email: '',
		role: ''
	}

	onSubmit = async () => {
		const { email, role } = this.state;
		const { AuthStore, match: { params: { orgId } }, OrganisationsStore, VisualStore } = this.props;

		VisualStore.setBusy(true);

		const doc = (await AuthStore.findByEmail(email)).docs[0];
		const uid = doc.exists ? doc.id : false;

		if (!uid) VisualStore.showFlag({
			title: 'Use does not exist',
			description: `There is no user with the e-mail address ${email}. Please invite the user to create an account first, or try a different e-mail address.`,
			appearance: 'error',
			icon: <Error />,
			actions: [
				{ content: 'Understood', onClick: () => {} } // TODO: Hide flag from this handler.
			]
		});
		else {
			const { code } = await OrganisationsStore.addUser(orgId, role, uid);
			if (code) VisualStore.showFlag({
				title: 'Something went wrong',
				description: `An error occurred trying to add the specified user to your organisation. Please try again.`,
				appearance: 'error',
				icon: <Error />,
				actions: [
					{ content: 'Understood', onClick: () => {} } // TODO: Hide flag from this handler.
				]
			});
			this.setState({ email: '', role: '' });
		}

		VisualStore.setBusy(false);
	}

	onRemoveClick = (uid) => (event) => {
		const { match: { params: { orgId } }, OrganisationsStore } = this.props;
		return OrganisationsStore.removeUser(orgId, uid);
	}

	render = () => {
		const { email, role } = this.state;
		const { AuthStore, match: { params: { orgId } }, OrganisationsStore, state } = this.props;
		const { busy } = state;
		const organisation = OrganisationsStore.getItem(orgId, '_id');
		const shouldPreventSubmit = isBlank(email) || isBlank(role) || !['admin', 'auditor', 'attestor'].includes(role.toLowerCase()) || busy;

		return (
			<section>
				<h1>User and group access</h1>
				<p>
					Keep in mind this is pre-release software. The following limitations exist:
				</p>
				<ul>
					<li>
						openSEA is only capable of adding <strong>existing users</strong> to an organisation through their <strong>full e-mail address</strong>.<br />
						A user that does not have an account will <strong>not</strong> be invited to the organisation.
					</li>
					<li>
						Applied roles don't do anything yet. All users have all rights, meaning essentially <strong>everyone is an "owner"</strong>.<br />
						This will be changed in the near future. Assign roles as you would like them to be, they will become<br />
						functional in a future release.
					</li>
				</ul>
				<Table
					columns={[
						{
							key: 'name',
							label: 'Name',
							value: ({ _uid }) => (AuthStore.getItem(_uid, '_uid') || {}).name,
							format: (val, { _uid }) => {
								const user = AuthStore.getItem(_uid, '_uid') || {};
								return <Link to={`/dashboard/people/${user._uid}`}>{ user._isCurrent ? 'You' : user.name }</Link>;
							}
						},
						{
							key: 'added',
							label: 'Added',
							format: (value) => moment().diff(value) > 86400000 ? moment(value).format('DD-MM-YYYY') : moment(value).fromNow()
						},
						{
							key: 'role',
							label: 'Role'
						},
						{
							key: '_uid',
							label: 'Actions',
							// TODO: Only show this when use has appropriate access
							// TODO: Make this work
							format: (val) => (
								<Button
									appearance="subtle"
									onClick={this.onRemoveClick(val)}
								><MdDelete width={20} height={20} /></Button>
							)
						}
					]}
					data={organisation._users}
					defaultSort="added"
					footer={[
						<TextField
							placeholder="Find a user"
							value={email}
							onChange={linkState(this, 'email')}
							fullWidth
							disabled={busy}
							colSpan={2}
						/>,
						<Select
							placeholder="Choose a role"
							value={role}
							onChange={linkState(this, 'role', 'target.value')}
							disabled={busy}
							fullWidth
						>
							<option value="admin">Administrator</option>
							<option value="auditor">Auditor</option>
							<option value="attestor">Attestor</option>
						</Select>,
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

export default OrganisationSettingsAccess;