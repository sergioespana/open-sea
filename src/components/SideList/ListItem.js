import { NavLink as Link } from 'react-router-dom';
import React from 'react';
import styled from 'styled-components';

const ListItem = styled(({ children, to, ...props }) => (
	<li {...props}>
		<Link
			to={to}
			exact
			activeStyle={{ fontWeight: 500, color: '#002c26' }}
		>{ children }</Link>
	</li>
)) `
	font-size: 0.875rem;

	a {
		display: block;
		padding: 7px 10px;
		word-wrap: break-word;
		color: #0052CC;

		:hover {
			background: rgba(9, 30, 66, 0.04);
			text-decoration: none;
		}
	}
`;

export default ListItem;