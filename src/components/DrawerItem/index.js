import { h } from 'preact';
import { NavLink } from 'react-router-dom';
import Icon from 'preact-material-components/Icon';
import style from './style';

const onClick = () => document.body.click();

const DrawerItem = ({ children, href, icon, label }) => (
	<NavLink to={href} exact={href === '/'} class={style.link} activeClassName={style.active} onClick={onClick}>
		{ icon && <Icon>{ icon }</Icon> }
		{ children.length > 0 ? children : label }
	</NavLink>
);

export default DrawerItem;
