import React from 'react';
import styled from '../../util/styled-components';

const UnstyledMenu = ({ children, className, innerProps }) => <div {...{ children, className, ...innerProps }} />;

export const Menu = styled(UnstyledMenu)`
	background-color: #ffffff;
	border-radius: 3px;
	box-shadow: 0 4px 8px -2px rgba(9, 30, 66, 0.25), 0 0 1px rgba(9, 30, 66, 0.31);
	left: 0;
	margin: 6px 0 0 0;
	min-width: 100%;
	overflow: auto;
	padding: 4px 0;
	position: absolute;
	top: 100%;
	z-index: 10;
`;

export default Menu;
