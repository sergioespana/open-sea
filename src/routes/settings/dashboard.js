import { h } from 'preact';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import Container from '../../components/Container';
import Avatar from '../../components/Avatar';
import { SettingsGroup, SettingsItem } from '../../components/Settings';

const Dashboard = (props, { mobxStores: { AuthStore } }) => (
	<Container slim>
		<SettingsGroup title="Account">
			<SettingsItem
				primary={AuthStore.user.get('name').first}
				secondary={AuthStore.user.get('email')}
				prefix={<Avatar src={AuthStore.user.get('avatar')}>{ AuthStore.user.get('name').full }</Avatar>}
				suffix={<Link to="/logout">Sign out</Link>}
			/>
			<SettingsItem primary="Update profile" to="/settings/profile" />
			<SettingsItem primary="Reset password" onClick={AuthStore.resetPassword} />
		</SettingsGroup>
		<SettingsGroup title="Notifications">
			<SettingsItem primary="Send me push notifications" enabled={AuthStore.user.get('notifications') || false} onClick={AuthStore.togglePushNotifications} hide={!Notification} />
			<SettingsItem primary="Send notifications to my email address" enabled={false} />
		</SettingsGroup>
		<SettingsGroup title="Organisations">
			<SettingsItem primary="Manage organisations" to="/" />
		</SettingsGroup>
	</Container>
);

export default observer(Dashboard);