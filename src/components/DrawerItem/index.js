import { h } from 'preact';
import { Link } from 'preact-router/match';
import Icon from 'preact-material-components/Icon';
import style from './style';

const onClick = () => document.body.click();

const DrawerItem = ({ children, href, icon, label }) => (
    <Link href={href} class={style.link} activeClassName={style.active} onClick={onClick}>
        { icon && <Icon>{ icon }</Icon> }
        { children.length > 0 ? children : label }
    </Link>
);

export default DrawerItem;
