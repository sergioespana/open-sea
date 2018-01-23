import { darken, readableColor } from 'polished';
import { createElement } from 'react';
import { Link } from 'components/Link';
import styled from 'styled-components';

const Button = styled(({ ...props }) => createElement(props.to ? Link : 'button', { ...props, type: props.to ? null : props.type || 'button' }))`
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
	
	:hover {
		cursor: pointer;
		color: ${({ theme }) => readableColor(theme.primary)};
		background-color: ${({ theme }) => theme.accent};
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