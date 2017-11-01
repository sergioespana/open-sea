import { h } from 'preact';
import styled from 'styled-components';

const Action = styled.button`
	border: none;
	font-family: inherit;
	font-size: inherit;
	font-weight: 500;
	text-transform: uppercase;
	background-color: transparent;
	margin: 0 0 0 24px;
	cursor: pointer;
	color: #90CAF9;

	@media (min-width: 601px) {
		margin: 0 0 0 48px;
	}
`;

export default Action;