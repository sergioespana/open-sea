import { h } from 'preact';
import ButtonBase from 'material-ui/ButtonBase';
import style from './style';

const IconButton = ({ children, icon, ...props }) => (
	<ButtonBase
		focusRipple
		className={style.iconbutton}
		{...props}
	>{ icon || children }</ButtonBase>
);

export default IconButton;