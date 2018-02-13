import { darken } from 'polished';
import React from 'react';
import styled from 'styled-components';

const TextInput = styled(({ fullWidth, ...props }) => <input {...props} />)`
	border: 2px solid ${({ theme }) => theme.light};
	border-radius: 5px;
	width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
	padding: 8px 7px;
	font-family: inherit;
	font-size: inherit;
	line-height: 20px;
	color: ${({ theme }) => theme.text.primary};
	background-color: ${({ theme }) => theme.light};
	resize: vertical;
	overflow-x: hidden;
	position: relative;
	transition: all 100ms ease-out;
	will-change: border-color, background-color;
	
	&::placeholder {
		color: ${({ theme }) => theme.text.secondary};
	}

	:hover {
		background-color: ${({ theme }) => darken(0.05, theme.light)};
		border-color: ${({ theme }) => darken(0.05, theme.light)};
	}

	:focus {
		border-color: ${({ theme }) => theme.accent};
		background-color: #fff;
	}

	// &[disabled] {
	// 	cursor: no-drop;
	// }
`;

export default TextInput;