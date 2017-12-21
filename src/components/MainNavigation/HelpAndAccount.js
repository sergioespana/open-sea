import { NavigationButton, NavigationContainer } from 'components/Navigation';
import MdAccountCircle from 'react-icons/lib/md/account-circle';
import MdHelp from 'react-icons/lib/md/help';
import React from 'react';

const HelpAndAccount = ({ loading }) => (
	<NavigationContainer>
		<NavigationButton round loading={loading}><MdHelp width={24} height={24} /></NavigationButton>
		<NavigationButton to="/account" round loading={loading}><MdAccountCircle width={24} height={24} /></NavigationButton>
	</NavigationContainer>
);

export default HelpAndAccount;