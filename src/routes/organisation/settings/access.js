import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { app } from 'mobx-app';
import Button from 'components/Button';
import { Link } from 'components/Link';
import linkState from 'linkstate';
import moment from 'moment';
import Table from 'components/Table';
import { TextField } from 'components/Input';
import trim from 'lodash/trim';

const isBlank = (str) => !trim(str);

@inject(app('AuthStore', 'OrganisationsStore'))
@observer
class OrganisationSettingsAccess extends Component {
	state = {
		email: '',
		role: ''
	}

	render = () => {
		const { email, role } = this.state;
		const { AuthStore, match: { params: { orgId } }, OrganisationsStore, state } = this.props;
		const { busy } = state;
		const organisation = OrganisationsStore.getItem(orgId, '_id');
		const shouldPreventSubmit = isBlank(email) || isBlank(role) || !['auditor', 'attestor'].includes(role.toLowerCase()) || busy;

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
							key: 'actions',
							label: 'Actions',
							// TODO: Only show this when use has appropriate access
							// TODO: Make this work
							format: () => <a>Remove</a>
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
						<TextField
							placeholder="Role"
							value={role}
							onChange={linkState(this, 'role')}
							disabled={busy}
							fullWidth
						/>,
						<Button
							appearance="primary"
							busy={busy}
							disabled={shouldPreventSubmit}
						>Add</Button>
					]}
				/>
			</section>
		);
	}
}

export default OrganisationSettingsAccess;