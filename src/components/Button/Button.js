import { darken, lighten, transparentize } from 'polished';
import React, { createElement } from 'react';
import { Link } from 'components/Link';
import omit from 'lodash/omit';
import Spinner from 'components/Spinner';
import styled from 'styled-components';

const getColor = ({ appearance = 'default', disabled, selected, theme }) => {
	if (disabled) return lighten(0.05, theme.text.secondary);

	switch (appearance) {
		case 'primary': return '#ffffff';
		case 'link': return '#0065FF';
		case 'subtle': return theme.text.primary;
		case 'subtle-link': return theme.text.secondary;
		case 'warning': return theme.text.primary;
		case 'help': return '#ffffff';
		default: return selected ? '#ffffff' : theme.text.primary;
	}
};

const getBackgroundColor = ({ appearance = 'default', disabled, selected, theme }) => {
	switch (appearance) {
		case 'primary': return selected ? '#113B34' : theme.primary;
		case 'link': return 'transparent';
		case 'subtle': return 'transparent';
		case 'subtle-link': return 'transparent';
		case 'warning': return '#FFAB00';
		case 'help': return '#DE350B';
		default: return selected ? '#113B34' : theme.light;
	}
};

const getHoverBackgroundColor = ({ appearance = 'default', disabled, selected, theme }) => {
	switch (appearance) {
		case 'primary': return selected ? '#113B34' : lighten(0.1, theme.primary);
		case 'link': return 'transparent';
		case 'subtle': return darken(0.05, theme.light);
		case 'subtle-link': return 'transparent';
		case 'warning': return lighten(0.1, '#FFAB00');
		case 'help': return lighten(0.1, '#DE350B');
		default: return selected ? '#113B34' : darken(0.05, theme.light);
	}
};

const getActiveColor = (props) => {
	const appearance = props.appearance || 'default';
	if (appearance === 'default') return props.theme.primary;
	return getColor(props);
};

const getActiveBackgroundColor = (props) => {
	const appearance = props.appearance || 'default';
	if (['primary', 'warning', 'help'].includes(appearance)) return darken(0.03, getBackgroundColor(props));
	if (['default', 'subtle'].includes(appearance)) return transparentize(0.7, props.theme.primary);
};

const getDisabledColor = ({ theme }) => theme.text.secondary;

const getDisabledBackgroundColor = (props) => getBackgroundColor(props) === 'transparent' ? 'transparent' : props.theme.light;

const Button = styled((props) => {
	const rest = omit(props, 'activeColor', 'activeBackgroundColor', 'appearance', 'busy', 'color', 'backgroundColor', 'hoverBackgroundColor', 'disabledColor', 'disabledBackgroundColor', 'isSelected');
	const to = rest.disabled ? undefined : rest.to;
	const type = to ? null : rest.type || 'button';
	const children = props.busy ? <Spinner /> : rest.children;
	return createElement(to ? Link : 'button', { ...rest, children, to, type });
}).attrs({
	color: (props) => getColor(props),
	backgroundColor: (props) => getBackgroundColor(props),
	hoverBackgroundColor: (props) => getHoverBackgroundColor(props),
	activeColor: (props) => getActiveColor(props),
	activeBackgroundColor: (props) => getActiveBackgroundColor(props),
	disabledColor: (props) => getDisabledColor(props),
	disabledBackgroundColor: (props) => getDisabledBackgroundColor(props)
})`
	height: 32px;
	width: auto;
	max-width: 100%;
	padding: 0 12px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	font-family: inherit;
	${({ appearance, disabled }) => (appearance === 'primary' && !disabled) && `font-weight: 500;`}
	text-decoration: none;
	border-radius: 3px;
	border: none;
	transition: background-color 100ms ease-out;
	color: ${({ color }) => color};
	background-color: ${({ backgroundColor }) => backgroundColor};
	
	:hover {
		cursor: pointer;
		color: ${({ color }) => color};
		background-color: ${ ({ hoverBackgroundColor }) => hoverBackgroundColor };
		text-decoration: ${({ appearance }) => ['link', 'subtle-link'].includes(appearance) ? 'underline' : 'none'};
	}	

	:active {
		color: ${({ activeColor }) => activeColor};
		background-color: ${({ activeBackgroundColor }) => activeBackgroundColor};
	}

	&[disabled] {
		cursor: not-allowed;

		${({ busy, disabledColor, disabledBackgroundColor }) => !busy && `
			color: ${disabledColor};
			background-color: ${disabledBackgroundColor};
			text-decoration: none;
		`}
	}
`;

export default Button;