import React from 'react';
import styled from 'styled-components';

const SideList = styled(({ children, ...props }) => (
	<aside {...props}>
		<nav>{ children }</nav>
	</aside>
))`
	padding: 20px 20px 20px 0;
	min-width: 220px;
	border-right: 1px solid #ccc;
`;

export default SideList;