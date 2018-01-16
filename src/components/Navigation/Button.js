import { ellipsis, transparentize } from 'polished';
import React, { createElement } from 'react';
import styled, { css } from 'styled-components';
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import { NavLink as Link } from 'react-router-dom';
import map from 'lodash/map';

const active = css`
	&[aria-current="true"] {
		background-color: ${transparentize(0.75, '#000')};
	}
`;

const round = css`
	border-radius: 50%;
	max-width: 40px;
	justify-content: center;

	img {
		border-radius: 50%;
	}
`;

const regular = css`
	border-radius: 3px;
	
	img {
		border-radius: ${({ large }) => large ? '3px' : '50%'};
	}

	${(props) => props.large && large}
`;

const large = css`
	height: 56px;

	span {
		font-weight: 500;
	}
`;

const Button = styled(({ children, icon, large, round, ...props }) => {
	const processed = isArray(children) ? map(children, (child) => isString(child) ? <span key={child}>{ child }</span> : child) : children;
	return createElement(props.to ? Link : 'button', props, processed);
})`
	// Reset default styles
	text-decoration: none;
	background: none;
	border: none;
	color: inherit;
	padding: 0;

	// Basic styles
	min-width: 40px;
	min-height: 40px;
	width: 100%;
	display: inline-flex;
	flex-wrap: nowrap;
	align-items: center;
	font-size: 0.875rem;
	
	svg {
		flex-shrink: 0;
		border-radius: 50%;

		:not(:only-child) {
			margin-left: 12px;
		}
	}
	
	img {
		width: 40px;
		height: 40px;
		margin-left: 4px;
		flex-shrink: 0;
	}
	
	span {
		${ellipsis()}
		margin: 0 12px;
		border-radius: 3px;
	}

	// Active styles (only for non-round buttons)
	${({ large, round }) => !large && !round && active}
	
	// Round specific styles
	${(props) => props.round ? round : regular }

	
	:hover {
		background-color: ${transparentize(0.65, '#000')};
		text-decoration: none;
		color: inherit;
		cursor: pointer;
	}
	
	:focus {
		box-shadow: inset 0 0 0 2px ${({ theme }) => theme.accent};
	}
	
	:active {
		background-color: ${({ theme }) => theme.accent};
	}

	// Disabled styles
	&[disabled] {
		pointer-events: none;
		cursor: default;
	}
`;

export default Button;