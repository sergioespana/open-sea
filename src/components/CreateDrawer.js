import { inject, observer } from 'mobx-react';
import { NavigationMain, NavigationHeader, NavigationContainer, NavigationButton } from 'components/Navigation';
import { app } from 'mobx-app';
import Drawer from 'components/Drawer';
import { Heading } from 'components/SideList';
import MdArrowBack from 'react-icons/lib/md/arrow-back';
import MdAssessment from 'react-icons/lib/md/assessment';
import MdBusiness from 'react-icons/lib/md/business';
import MdGroupWork from 'react-icons/lib/md/group-work';
import MdHome from 'react-icons/lib/md/home';
import React from 'react';

{/* <NavigationButton to="/create/network" onClick={MVCStore.toggleCreateDrawer} icon={<MdGroupWork width={24} height={24} />}>Network</NavigationButton> */}
const CreateDrawer = inject(app('MVCStore'))(observer((props) => {
	const { MVCStore, state } = props;
	const { createDrawerOpen } = state;

	return (
		<Drawer
			hasPlaceholder
			open={createDrawerOpen}
			onRequestClose={MVCStore.toggleCreateDrawer}
		>
			<NavigationMain color="#ffffff">
				<NavigationContainer>
					<NavigationHeader>
						<NavigationButton to="/" round disabled><MdHome width={24} height={24} /></NavigationButton>
					</NavigationHeader>
					<NavigationButton round disabled />
					<NavigationButton round onClick={MVCStore.toggleCreateDrawer}><MdArrowBack width={24} height={24} /></NavigationButton>
				</NavigationContainer>
			</NavigationMain>
			<NavigationMain color="#ffffff" width={286}>
				<NavigationContainer fullWidth>
					<NavigationHeader />
					<NavigationButton disabled />
					<Heading>Create a new</Heading>
					<NavigationButton to="/create/report" onClick={MVCStore.toggleCreateDrawer} icon={<MdAssessment width={24} height={24} />}>Report</NavigationButton>
					<NavigationButton to="/create/organisation" onClick={MVCStore.toggleCreateDrawer} icon={<MdBusiness width={24} height={24} />}>Organisation</NavigationButton>
				</NavigationContainer>
			</NavigationMain>
		</Drawer>
	);
}));

export default CreateDrawer;