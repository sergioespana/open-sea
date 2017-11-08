import { h } from 'preact';
import Container from '../../components/Container';
import { SettingsGroup, SettingsItem } from '../../components/Settings';

const Profile = () => (
	<Container slim>
		<SettingsGroup>
			<SettingsItem primary="Todo" />
		</SettingsGroup>
	</Container>
);

export default Profile;