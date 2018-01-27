import { createElement } from 'react';
import { darken } from 'polished';
import { Link } from 'components/Link';
import styled from 'styled-components';

const Button = styled(({ bg, color, cta, ...props }) => createElement(props.to ? Link : 'button', { ...props, type: props.to ? null : props.type || 'button' }))`
	height: 32px;
	width: auto;
	padding: 4px 10px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	font-family: inherit;
	font-size: 0.875rem;
	font-weight: ${({ cta }) => cta ? 700 : 'inherit'};
	color: ${({ color, theme }) => theme.text[color] || color || theme.text.primary};
	background-color: ${({ bg, theme }) => theme[bg] || bg || theme.primary};
	border-radius: 3px;
	border: none;

	&:not(:first-child) {
		margin-left: 4px;
	}
	
	:hover {
		cursor: pointer;
		color: ${({ color, theme }) => theme.text[color] || color || theme.text.primary};
		background-color: ${({ bg, theme }) => theme[bg] || bg || theme.primary}; // TODO: Make slightly lighter or darker depending on luminance.
		text-decoration: none;
	}

	:active {
		${({ bg, theme }) => bg === 'light' && `
			color: ${theme.text.contrast};
			background-color: ${theme.primary};
		`}
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