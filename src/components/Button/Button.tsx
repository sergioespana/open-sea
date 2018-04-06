import { darken, lighten, transparentize } from 'polished';
import { createElement, HTMLProps } from 'react';
import styled from 'styled-components';
import { Link } from '../Link';

interface ButtonProps extends HTMLProps<HTMLButtonElement> {
	appearance?: 'default' | 'error' | 'light' | 'link' | 'subtle' | 'subtle-link' | 'warning';
	theme?: any;
	to: any;
}

const getBG = (state?: 'hover' | 'active') => (props: ButtonProps) => {
	const { appearance, selected, theme } = props;
	const hover = state === 'hover';
	const active = state === 'active';

	switch (appearance) {
	case 'error':
		return hover ? lighten(0.05, theme.red) : active ? darken(0.03, theme.red) : theme.red;
	case 'light':
		return hover ? darken(0.05, theme.light) : active ? transparentize(0.7, theme.primary) : theme.light;
	case 'link':
		return 'transparent';
	case 'subtle':
		return selected ? theme.muted : hover ? theme.light : active ? transparentize(0.7, theme.primary) : 'transparent';
	case 'subtle-link':
		return 'transparent';
	case 'warning':
		return hover ? lighten(0.05, theme.yellow) : active ? darken(0.03, theme.yellow) : theme.yellow;
	default:
		return selected ? theme.muted : hover ? lighten(0.05, theme.primary) : active ? darken(0.03, theme.primary) : theme.primary;
	}
};

const getC = (state?: 'hover' | 'active') => (props: ButtonProps) => {
	const { appearance, selected, theme } = props;
	const hover = state === 'hover';
	const active = state === 'active';

	switch (appearance) {
	case 'error':
		return '#ffffff';
	case 'light':
		return active ? theme.primary : theme.text.primary;
	case 'link':
		return hover ? lighten(0.10, theme.text.link) : theme.text.link;
	case 'subtle':
		return selected ? '#ffffff' : active ? theme.primary : theme.text.primary;
	case 'subtle-link':
		return theme.text.secondary;
	case 'warning':
		return '#ffffff';
	default:
		return '#ffffff';
	}
};

export default styled<ButtonProps, any>((props) => createElement(props.to ? Link : 'button', props))`
	align-items: center;
	background-color: ${getBG()};
	border-radius: 3px;
	color: ${getC()};
	display: inline-flex;
	font-family: inherit;
	font-size: inherit;
	font-weight: ${({ appearance = 'default', disabled }) => appearance === 'default' && !disabled ? 500 : 'initial'};
	height: 32px;
	justify-content: center;
	padding: 0 12px;
	text-align: center;

	:hover {
		background-color: ${getBG('hover')};
		color: ${getC('hover')};
		cursor: pointer;
		text-decoration: ${({ appearance }) => ['link', 'subtle-link'].includes(appearance) ? 'underline' : 'none'};
	}

	:active {
		background-color: ${getBG('active')};
		color: ${getC('active')};
	}

	&[disabled]:hover,
	&[disabled="true"]:hover {
		cursor: not-allowed;
	}
`;
