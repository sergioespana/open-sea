import { h } from 'preact';
import IconToggle from 'preact-material-components/IconToggle';
import 'preact-material-components/IconToggle/style.css';
import classnames from 'classnames/bind';
import style from './style';

const cx = classnames.bind(style);

const Header = ({ hasScrolled, toggleDrawer }) => (
	<header
		class={cx({
			header: true,
			hasScrolled
		})}
	>
		<IconToggle id="menutoggle" onClick={toggleDrawer}>menu</IconToggle>
		<IconToggle>more_vert</IconToggle>
	</header>
);

export default Header;

// TODO: Check for proptypes
