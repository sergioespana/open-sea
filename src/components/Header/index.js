import { h } from 'preact';
import classnames from 'classnames/bind';
import style from './style';
import IconButton from '../IconButton';
import IconMenu from '../IconMenu';

import MenuIcon from 'material-ui-icons/Menu';
import MoreVertIcon from 'material-ui-icons/MoreVert';

const cx = classnames.bind(style);

const Header = ({ hasScrolled, toggleDrawer }) => (
	<header
		class={cx({
			header: true,
			hasScrolled
		})}
	>
		<IconButton id="menutoggle" onClick={toggleDrawer}><MenuIcon /></IconButton>
		<IconMenu icon={<MoreVertIcon />}>
			<div>stuff</div>
		</IconMenu>
	</header>
);

export default Header;
