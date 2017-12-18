import { inject, observer } from 'mobx-react';
import { NavigationButton, NavigationHeader } from 'components/Navigation';
import MdAssessment from 'react-icons/lib/md/assessment';
import MdInbox from 'react-icons/lib/md/inbox';
import MdSettings from 'react-icons/lib/md/settings';
import React from 'react';

const OrgButtons = inject('OrganisationsStore')(observer(({ OrganisationsStore, match: { params: { org } } }) => {
	const organisation = OrganisationsStore.findById(org, true) || {},
		avatar = organisation.avatar || 'https://via.placeholder.com/40x40/00695C';
	return (
		<React.Fragment>
			<NavigationHeader>
				<NavigationButton to={`/${org}`} exact large icon={<img src={avatar} />}>{ organisation.name }</NavigationButton>
			</NavigationHeader>
			<NavigationButton to={`/${org}/overview`} exact icon={<MdInbox width={24} height={24} />}>Overview</NavigationButton>
			<NavigationButton to={`/${org}/reports`} icon={<MdAssessment width={24} height={24} />}>Reports</NavigationButton>
			<NavigationButton to={`/${org}/settings`} icon={<MdSettings width={24} height={24} />}>Settings</NavigationButton>
		</React.Fragment>
	);
}));

export default OrgButtons;