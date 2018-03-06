import React from 'react';
import styled from 'styled-components';

const Prefix = styled(({ ...props }) => <div {...props} />) `
	padding: 0 0 0 7px;
	font-family: inherit;
	font-size: inherit;
	color: ${({ theme }) => theme.text.primary};
	white-space: pre;
	display: flex;
	align-items: center;
	pointer-events: none;
`;

export default Prefix;