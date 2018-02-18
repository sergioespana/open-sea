import { darken } from 'polished';
import React from 'react';
import styled from 'styled-components';

const Prefix = styled(({ ...props }) => <span {...props} />) `
	background-color: ${({ theme }) => darken(0.075, theme.light)};
	border-radius: 3px 0 0 3px;
	min-height: 32px;
	padding: 0 14px 0 8px;
	line-height: 32px;
	font-family: inherit;
	font-size: inherit;
	color: ${({ theme }) => theme.text.primary};
	white-space: pre;

	& + input {
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		margin-left: 2px;
	}
`;

export default Prefix;