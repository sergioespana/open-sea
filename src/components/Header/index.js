import { h, Component } from 'preact';

import IconToggle from 'preact-material-components/IconToggle';
import 'preact-material-components/IconToggle/style.css';

import classnames from 'classnames/bind';
import style from './style';
let cx = classnames.bind(style);

export default class Header extends Component {
	render({ hasScrolled }) {
		return (
			<header
				class={cx({
					header: true,
					hasScrolled
				})}
			>
				<IconToggle>menu</IconToggle>
				<IconToggle>more_vert</IconToggle>
			</header>
		);
	}
}

// TODO: Check for proptypes
