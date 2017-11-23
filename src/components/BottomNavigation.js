import { default as BottomNav, BottomNavigationButton, BottomNavigationLabel, BottomNavigationIcon } from 'material-styled-components/BottomNavigation';
import { Link } from 'react-router-dom';
import MdAssessment from 'react-icons/lib/md/assessment';
import MdAssistant from 'react-icons/lib/md/assistant';
import MdDashboard from 'react-icons/lib/md/dashboard';
import MdPeople from 'react-icons/lib/md/people';
import React from 'react';

const ExtendedBottomNav = BottomNav.extend`
	@media (min-width: 601px) and (max-width: 1025px) {
		display: none;
	}
`;

const BottomNavigation = ({ id }) => (
	<ExtendedBottomNav>
		<BottomNavigationButton component={Link} to={`/${id}/assistant`}>
			<BottomNavigationIcon><MdAssistant width={24} height={24} /></BottomNavigationIcon>
			<BottomNavigationLabel>Assistant</BottomNavigationLabel>
		</BottomNavigationButton>
		<BottomNavigationButton component={Link} to={`/${id}`}>
			<BottomNavigationIcon><MdDashboard width={24} height={24} /></BottomNavigationIcon>
			<BottomNavigationLabel>Overview</BottomNavigationLabel>
		</BottomNavigationButton>
		<BottomNavigationButton component={Link} to={`/${id}/reports`}>
			<BottomNavigationIcon><MdAssessment width={24} height={24} /></BottomNavigationIcon>
			<BottomNavigationLabel>Reports</BottomNavigationLabel>
		</BottomNavigationButton>
		<BottomNavigationButton component={Link} to={`/${id}/sharing`}>
			<BottomNavigationIcon><MdPeople width={24} height={24} /></BottomNavigationIcon>
			<BottomNavigationLabel>Sharing</BottomNavigationLabel>
		</BottomNavigationButton>
	</ExtendedBottomNav>
);

export default BottomNavigation;