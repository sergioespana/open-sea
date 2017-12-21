import { NavigationButton, NavigationHeader } from 'components/Navigation';
import MdBusiness from 'react-icons/lib/md/business';
import MdGroupWork from 'react-icons/lib/md/group-work';
import MdInbox from 'react-icons/lib/md/inbox';
import React from 'react';

const MainButtons = ({ hideTitle, loading }) => (
	<React.Fragment>
		{ hideTitle ? null : loading ? (
			<NavigationHeader><NavigationButton large loading={loading} bright /></NavigationHeader>
		) : (
			<NavigationHeader><h1>openSEA</h1></NavigationHeader>
		) }
		<NavigationButton to="/dashboard/overview" icon={<MdInbox width={24} height={24} />} loading={loading}>Overview</NavigationButton>
		<NavigationButton to="/dashboard/organisations" icon={<MdBusiness width={24} height={24} />} loading={loading}>Organisations</NavigationButton>
		<NavigationButton to="/dashboard/networks" icon={<MdGroupWork width={24} height={24} />} loading={loading}>Networks</NavigationButton>
	</React.Fragment>
);

export default MainButtons;