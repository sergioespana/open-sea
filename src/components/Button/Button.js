import { darken, lighten, readableColor } from 'polished';
import { createElement } from 'react';
import { Link } from 'components/Link';
import styled from 'styled-components';

const Button = styled(({ bg, color, large, ...props }) => createElement(props.to ? Link : 'button', { ...props, type: props.to ? null : props.type || 'button' }))`
	height: 32px;
	width: auto;
	padding: 4px 10px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	font-family: inherit;
	font-size: 0.875rem;
	font-weight: ${({ large }) => large ? 700 : 'inherit'};
	color: ${({ color, theme }) => theme.text[color] || theme.text.primary};
	background-color: ${({ bg, theme }) => theme[bg] || theme.primary};
	border: none;

	&:not(:first-child) {
		margin-left: 4px;
	}

	&:first-child {
		border-top-left-radius: 3px;
		border-bottom-left-radius: 3px;
	}
	
	&:last-child {
		border-top-right-radius: 3px;
		border-bottom-right-radius: 3px;
	}
	
	:hover {
		cursor: pointer;
		color: ${({ color, theme }) => theme.text[color] || theme.text.primary};
		background-color: ${({ bg, theme }) => theme[bg] || theme.primary};
		text-decoration: none;
	}
	
	:focus:not(:active) {
		box-shadow: 0 0 0 2px ${({ theme }) => theme.accent};
	}

	&[disabled] {
		pointer-events: none;
		color: ${darken(0.3, '#f5f5f5')};
		background-color: #f5f5f5;
	}
`;

export default Button;