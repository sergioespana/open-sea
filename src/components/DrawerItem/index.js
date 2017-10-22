import { h } from 'preact';
import { NavLink } from 'react-router-dom';
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import style from './style';

const onClick = () => document.body.click();

const DrawerItem = ({ children, href, icon, label }) => (
	<NavLink
		to={href}
		exact={href === '/'}
		className={style.link}
		activeClassName={style.active}
	>
		<ListItem
			button
			onClick={onClick}
		>
			{ icon ? <ListItemIcon>{ icon }</ListItemIcon> : null }
			{ children.length > 0 ? children : <ListItemText primary={label} /> }
		</ListItem>
	</NavLink>
);

export default DrawerItem;
