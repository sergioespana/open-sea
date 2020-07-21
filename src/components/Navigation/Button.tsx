import { isArray, isNull, isString, map } from 'lodash';
import { darken, transparentize } from 'polished';
import React, { createElement } from 'react';
import { MdArrowBack } from 'react-icons/md';
import { LinkProps } from 'react-router-dom';
import styled from 'styled-components';
import { NavLink } from '../Link';

export interface ButtonProps extends LinkProps {
	appearance: 'default' | 'light';
	large?: boolean;
	round?: boolean;
	square?: boolean;
}

// TODO: Remove margin from svg and img, add padding to root element.
export const Button = styled<ButtonProps, any>((props: ButtonProps) => createElement(props.to ? NavLink : 'button', props, wrapStrings(props.children))) `
	align-items: center;
	background-color: transparent;
	border-radius: ${({ round }) => round ? '50%' : '3px'};
	color: inherit;
	display: inline-flex;
	flex-wrap: nowrap;
	font-weight: ${({ large }) => large ? 600 : 400};
	height: ${({ large }) => large ? 56 : 40}px;
	justify-content: ${({ round, square }) => round || square ? 'center' : 'flex-start'};
	max-width: ${({ round, square }) => round || square ? '40px' : '100%'};
	min-width: 40px;
	overflow: hidden;
	padding: 0 2px;
	text-overflow: ellipsis;
	white-space: nowrap;
	width: 100%;
	word-wrap: normal;

	&[aria-current="true"] {
		${({ appearance, large, round, square, theme }) => (!large && !round && !square) && `background-color: ${darken(0.05, appearance === 'light' ? theme.light : theme.primary)};`}
	}

	:hover {
		background-color: ${({ appearance, theme }) => darken(0.07, appearance === 'light' ? theme.light : theme.primary)};
		color: inherit;
		cursor: pointer;
		text-decoration: none;
	}

	:active {
		background-color: ${({ appearance, theme }) => appearance === 'light' ? transparentize(0.7, theme.accent) : theme.accent};
	}

	& > svg {
		flex: 0 0 24px;
		height: 24px;
		margin: ${({ round }) => round ? 0 : '0 10px 0 8px'};
	}

	& > img {
		border: ${({ round }) => round ? '2px solid #ffffff' : 'none'};
		border-radius: ${({ round }) => round ? '50%' : '3px'};
		flex: 0 0 ${({ large, round }) => round ? 32 : large ? 40 : 24}px;
		height: ${({ large, round }) => round ? 32 : large ? 40 : 24}px;
		margin: ${({ round }) => round ? '0' : '0 8px 0 0'};
		object-fit: contain;
		width: ${({ large, round }) => round ? 32 : large ? 40 : 24}px;
	}

	& > span {
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		word-wrap: normal;
	}
`;

const BackButtonContainer = styled.div`
	align-items: center;
	display: flex;
	flex-wrap: nowrap;
	margin: 0 0 16px 0;
	width: 100%;
`;
const LabelContainer = styled.span`
	font-weight: 600;
	margin-left: 8px;
`;
export const BackButton = ({ children, ...props }) => (
	<BackButtonContainer>
		<Button square {...props}><MdArrowBack /></Button>
		<LabelContainer>{children}</LabelContainer>
	</BackButtonContainer>
);

const wrapStrings = (children: any) => isArray(children)
	? map(children, (child) => isString(child) || isNull(child)
		? <span key={child}>{child}</span>
		: child)
	: children;
