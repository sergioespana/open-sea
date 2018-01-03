import { darken, lighten, readableColor } from 'polished';
import React, { createElement } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Button = styled(({ ...props }) => createElement(
	props.to ? Link : 'button',
	props
))`
	height: 32px;
	width: auto;
	padding: 4px 10px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border-radius: 3px;
	font-size: 0.875rem;
	font-weight: 700;
	color: ${({ theme }) => readableColor(theme.primary)};
	background-color: ${({ theme }) => theme.primary};
	border: none;

	${({ disabled }) => disabled && `
		pointer-events: none;
		color: ${darken(0.3, '#f5f5f5')};
		background-color: #f5f5f5;
	`}

	:hover {
		cursor: pointer;
		color: ${({ theme }) => readableColor(theme.primary)};
		background-color: ${({ theme }) => lighten(0.05, theme.primary)};
		text-decoration: none;
	}
`;

export default Button;