import { h } from 'preact';
import Main from '../../components/Main';
import { observer } from 'mobx-react';
import capitalize from 'lodash/capitalize';
import Container from '../../components/Container';
import Avatar from '../../components/Avatar';
import { SettingsGroup, SettingsItem } from '../../components/Settings';

const Settings = ({ match: { params: { id } } }, { mobxStores: { OrgStore, AuthStore, DialogStore } }) => {
	let organisation = OrgStore.organisations.get(id),
		isOwner = organisation.get('_role') === 'owner',
		dashUrl = `${window.location.protocol}//${window.location.host}/${id}`,
		user = AuthStore.user;
	
	return (
		<Main bg="#eee">
			<Container slim>
				<SettingsGroup title="General">
					<SettingsItem
						primary={organisation.get('name')}
						secondary={organisation.get('_id')}
						prefix={<Avatar src={organisation.get('logo')}>{ organisation.get('name') }</Avatar>}
					/>

					<SettingsItem primary="Change organisation name" hide={!isOwner} />
					<SettingsItem primary="Upload an avatar" hide={!isOwner || organisation.has('avatar')} />
				</SettingsGroup>
					
				<SettingsGroup title="Sharing">
					<SettingsItem
						primary="You"
						secondary={capitalize(organisation.get('_role'))}
						prefix={<Avatar src={user.get('avatar')}>{ user.get('name').full }</Avatar>}
					/>

					<SettingsItem primary="Transfer ownership" hide={!isOwner} />

					<SettingsItem
						primary="Make public"
						secondary={organisation.get('public') ? <span>Organisation's dashboard is currently available to everyone <a href={dashUrl}>here</a></span> : null}
						enabled={organisation.get('public')}
						onClick={() => OrgStore.togglePublic(id)}
						hide={!isOwner}
					/>
				</SettingsGroup>

				<SettingsGroup title="Delete" hide={!isOwner}>
					<SettingsItem
						primary="Reset"
						secondary="Remove all data without removing the organisation itself"
					/>
					<SettingsItem
						primary="Delete"
						secondary="Permanently delete this organisation and all of its reports"
					/>
				</SettingsGroup>
			</Container>
		</Main>
	);
};

export default observer(Settings);