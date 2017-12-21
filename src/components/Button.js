import { darken, lighten, readableColor } from 'polished';
import React, { createElement } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

const rotate = keyframes`
	100% {
		transform: rotate(360deg);
	}
`;

const dash = keyframes`
	0% {
		stroke-dasharray: 1, 200;
		stroke-dashoffset: 0;
	}
	50% {
		stroke-dasharray: 100, 200;
		stroke-dashoffset: -15;
	}
	100% {
		stroke-dasharray: 100, 200;
		stroke-dashoffset: -120;
	}
`;

const Progress = styled(({ ...props }) => (
	<div {...props}>
		<svg viewBox="0 0 50 50">
			<circle cx="25" cy="25" r="18" fill="none" stroke-width="4.5" />
		</svg>
	</div>
))`
	width: 24px;
	height: 24px;
	margin-left: 8px;

	svg {
		animation: ${rotate} 1.4s linear infinite;
		
		circle {
			stroke-dasharray: 80,200;
			stroke-dashoffset: 0;
			stroke: currentColor;
			stroke-linecap: round;
			animation: ${dash} 1.4s linear infinite;
		}
	}
`;

const Button = styled(({ busy, children, ...props }) => createElement(
	props.to ? Link : 'button',
	props,
	children,
	busy && <Progress />
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

	${({ busy }) => busy && `pointer-events: none;`}
	
	:hover {
		cursor: pointer;
		color: ${({ theme }) => readableColor(theme.primary)};
		background-color: ${({ theme }) => lighten(0.05, theme.primary)};
		text-decoration: none;
	}
`;

export default Button;