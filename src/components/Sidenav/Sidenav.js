import React from 'react';
import styled from 'styled-components';

const Sidenav = styled(({ children, ...props }) => (
	<aside {...props}>
		<nav>{ children }</nav>
	</aside>
))`
	padding: 0 20px 0 0;
	border-right: 1px solid #ccc;
	width: 240px;

	nav {
		display: flex;
		flex-direction: column;

		h3 {
			color: ${({ theme }) => theme.text.secondary};
			font-weight: 700;
			font-size: 0.75rem;
			text-transform: uppercase;
			padding: 7px 10px;
			margin: 0;

			&:not(:first-child) {
				margin-top: 5px;
				border-top: 1px solid #ccc;
			}
		}

		a {
			padding: 7px 10px;
			
			:hover {
				text-decoration: none;
				background-color: ${({ theme }) => theme.light};
			}

			&[aria-current="true"] {
				color: inherit;
				font-weight: 700;
			}
		}
	}
`;

export default Sidenav;