import { darken, lighten } from 'polished';
import { createElement } from 'react';
import { Link } from 'components/Link';
import styled from 'styled-components';

const getColor = ({ appearance, disabled, selected, theme }) => {
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

const getBackgroundColor = ({ appearance, disabled, selected, theme }) => {
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

const getHoverBackgroundColor = ({ appearance, disabled, selected, theme }) => {
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

const getDisabledColor = ({ theme }) => theme.text.secondary;

const getDisabledBackgroundColor = (props) => getBackgroundColor(props) === 'transparent' ? 'transparent' : props.theme.light;

const Button = styled((props) => {
	const { appearance, color, backgroundColor, hoverBackgroundColor, disabledColor, disabledBackgroundColor, isSelected, ...rest } = props;
	const to = rest.disabled ? undefined : rest.to;
	const type = to ? null : rest.type || 'button';
	return createElement(to ? Link : 'button', { ...rest, to, type });
}).attrs({
	color: (props) => getColor(props),
	backgroundColor: (props) => getBackgroundColor(props),
	hoverBackgroundColor: (props) => getHoverBackgroundColor(props),
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
	font-size: 0.875rem;
	text-decoration: none;
	border-radius: 3px;
	border: none;
	transition: background-color 100ms ease-out;

	color: ${({ color }) => color};
	background-color: ${({ backgroundColor }) => backgroundColor};

	:hover {
		cursor: pointer;
		background-color: ${ ({ hoverBackgroundColor }) => hoverBackgroundColor };
		text-decoration: ${({ appearance }) => ['link', 'subtle-link'].includes(appearance) ? 'underline' : 'none'};
	}

	&[disabled] {
		cursor: not-allowed;
		color: ${({ disabledColor }) => disabledColor};
		background-color: ${({ disabledBackgroundColor }) => disabledBackgroundColor};
		text-decoration: none;
	}

	&:not(:first-child) {
		margin-left: 4px;
	}
`;

export default Button;