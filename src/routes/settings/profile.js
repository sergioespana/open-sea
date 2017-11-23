import { Link } from 'react-router-dom';
import Main from 'components/Main';
import React from 'react';

const Profile = () => (
	<Main container slim>
		<h1>Profile</h1>
		<ul>
			<li><Link to="/logout">Logout</Link></li>
		</ul>
	</Main >
);

export default Profile;