import { darken, lighten, transparentize } from 'polished';
import React, { HTMLProps } from 'react';
import { Link, LinkProps } from 'react-router-dom';
import styled, { css } from '../util/styled-components';

const getBackgroundColor = (state?: 'hover' | 'active') => (props) => {
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

const getColor = (state?: 'hover' | 'active') => (props) => {
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

export const buttonStyles = css`
	align-items: center;
	background-color: ${getBackgroundColor()};
	border-radius: 3px;
	color: ${getColor()};
	display: inline-flex;
	font-family: inherit;
	font-size: inherit;
	font-weight: ${({ appearance = 'default', disabled }) => appearance === 'default' && !disabled ? 500 : 'initial'};
	height: 32px;
	justify-content: center;
	padding: 0 12px;
	text-align: center;

	:hover {
		background-color: ${getBackgroundColor('hover')};
		color: ${getColor('hover')};
		cursor: pointer;
		text-decoration: ${({ appearance }) => ['link', 'subtle-link'].includes(appearance) ? 'underline' : 'none'};
	}

	:active {
		background-color: ${getBackgroundColor('active')};
		color: ${getColor('active')};
	}

	&[disabled]:hover,
	&[disabled="true"]:hover {
		cursor: not-allowed;
	}
`;

export interface Props {
	appearance: 'default' | 'error' | 'light' | 'link' | 'subtle' | 'subtle-link' | 'warning';
}
export interface ButtonProps extends Props, HTMLProps<HTMLButtonElement> {}
export interface LinkButtonProps extends Props, LinkProps {}

export const UnstyledButton: React.SFC<ButtonProps> = (props) => <button {...props} />;
export const UnstyledLinkButton: React.SFC<LinkButtonProps> = (props) => <Link {...props} />;

export const Button = styled(UnstyledButton)`${buttonStyles}`;
export const LinkButton = styled(UnstyledLinkButton)`${buttonStyles}`;
export default Button;
