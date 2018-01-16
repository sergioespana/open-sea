import { Content, Group, Header, Inner, Button, Section } from 'components/Navigation';
import { inject, observer } from 'mobx-react';
import { app } from 'mobx-app';
import Drawer from 'components/Drawer';
import MdArrowBack from 'react-icons/lib/md/arrow-back';
import MdAssessment from 'react-icons/lib/md/assessment';
import MdBusiness from 'react-icons/lib/md/business';
import MdGroupWork from 'react-icons/lib/md/group-work';
import MdHome from 'react-icons/lib/md/home';
import React from 'react';

const iconProps = { width: 24, height: 24 };

const CreateDrawer = inject(app('VisualStore'))(observer((props) => {
	const { state, VisualStore } = props;
	const { createDrawerOpen: open } = state;
	const toggle = VisualStore.toggleCreateDrawer;
	
	return (
		<Drawer open={open} onRequestClose={toggle}>
			<Section width={64} bg="#fff">
				<Inner>
					<Content>
						<Header>
							<Button round disabled><MdHome {...iconProps} /></Button>
						</Header>
						<Group>
							<Button round disabled />
							<Button round onClick={toggle}><MdArrowBack {...iconProps} /></Button>
						</Group>
					</Content>
				</Inner>
			</Section>
			<Section width={290} bg="#fff">
				<Inner>
					<Content fullWidth>
						<Header />
						<Group>
							<Button disabled />
							<Button to="/create/report" onClick={toggle}><MdAssessment {...iconProps} />Report</Button>
							<Button to="/create/organisation" onClick={toggle}><MdBusiness {...iconProps} />Organisation</Button>
							<Button to="/create/network" onClick={toggle}><MdGroupWork {...iconProps} />Network</Button>
						</Group>
					</Content>
				</Inner>
			</Section>
		</Drawer>
	);
}));

export default CreateDrawer;