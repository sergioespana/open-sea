import { inject, observer } from 'mobx-react';
import { Link, Route } from 'react-router-dom';
import List, { ListItem, ListItemText, ListItemIcon } from 'material-styled-components/List';
import { default as Aside } from 'material-styled-components/Drawer';
import MdArchive from 'react-icons/lib/md/archive';
import MdAssessment from 'react-icons/lib/md/assessment';
import MdAssistant from 'react-icons/lib/md/assistant';
import MdDashboard from 'react-icons/lib/md/dashboard';
import MdDelete from 'react-icons/lib/md/delete';
import MdFeedback from 'react-icons/lib/md/feedback';
import MdHelp from 'react-icons/lib/md/help';
import MdPeople from 'react-icons/lib/md/people';
import MdSettings from 'react-icons/lib/md/settings';
import React from 'react';

const OrganisationItems = inject('MVCStore')(observer(({ MVCStore, match: { params: { id } } }) => [
	<List key={0}>
		<Link to={`/${id}/assistant`}>
			<ListItem>
				<ListItemIcon><MdAssistant width={24} height={24} /></ListItemIcon>
				<ListItemText primary="Assistant" />
			</ListItem>
		</Link>
		<Link to={`/${id}`}>
			<ListItem>
				<ListItemIcon><MdDashboard width={24} height={24} /></ListItemIcon>
				<ListItemText primary="Overview" />
			</ListItem>
		</Link>
		<Link to={`/${id}/reports`}>
			<ListItem>
				<ListItemIcon><MdAssessment width={24} height={24} /></ListItemIcon>
				<ListItemText primary="Reports" />
			</ListItem>
		</Link>
		<Link to={`/${id}/sharing`}>
			<ListItem>
				<ListItemIcon><MdPeople width={24} height={24} /></ListItemIcon>
				<ListItemText primary="Sharing" />
			</ListItem>
		</Link>
	</List>,
	<List key={1}>
		<Link to={`/${id}/archive`}>
			<ListItem>
				<ListItemIcon><MdArchive width={24} height={24} /></ListItemIcon>
				<ListItemText primary="Archive" />
			</ListItem>
		</Link>
		<Link to={`/${id}/trash`}>
			<ListItem>
				<ListItemIcon><MdDelete width={24} height={24} /></ListItemIcon>
				<ListItemText primary="Bin" />
			</ListItem>
		</Link>
		<Link to={`/${id}/settings`}>
			<ListItem>
				<ListItemIcon><MdSettings width={24} height={24} /></ListItemIcon>
				<ListItemText primary="Organisation settings" />
			</ListItem>
		</Link>
	</List>
]));

const Drawer = inject('MVCStore')(observer(({ MVCStore }) => (
	<Aside
		open={MVCStore.drawerOpen}
		mode="temporary"
		onRequestClose={MVCStore.toggleDrawer}
	>
		<Route path="/:id" component={OrganisationItems} />
		<List>
			<Link to="/help">
				<ListItem>
					<ListItemIcon><MdHelp width={24} height={24} /></ListItemIcon>
					<ListItemText primary="Get help" />
				</ListItem>
			</Link>
			<Link to="/contact">
				<ListItem>
					<ListItemIcon><MdFeedback width={24} height={24} /></ListItemIcon>
					<ListItemText primary="Send feedback" />
				</ListItem>
			</Link>
			<Link to="/settings">
				<ListItem>
					<ListItemIcon><MdSettings width={24} height={24} /></ListItemIcon>
					<ListItemText primary="Settings" />
				</ListItem>
			</Link>
		</List>
	</Aside>
)));

export default Drawer;