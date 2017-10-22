import { h } from 'preact';
import classnames from 'classnames/bind';
import style from './style';

const cx = classnames.bind(style);

const Container = ({ children, slim, ...props }) => (
	<div
		class={cx({
			container: true,
			slim
		})}
		{...props}
	>
		{ children }
	</div>
);

export default Container;

// TODO: Check for proptypes
