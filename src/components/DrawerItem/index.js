import { h, Component } from 'preact';
import { Link } from 'preact-router/match';
import Icon from 'preact-material-components/Icon';
import style from './style';

const DrawerItem = ({ children, href, icon, label }) => (
    <Link href={href} class={style.link} activeClassName={style.active} onClick={() => document.body.click()}>
        { icon && <Icon>{ icon }</Icon> }
        { children.length > 0 ? children : label }
    </Link>
);

export default DrawerItem;
