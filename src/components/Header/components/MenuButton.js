import { h } from 'preact';
import styled from 'styled-components';

const MenuButton = (props) => (
	<button {...props}>
		<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
			<path d="M0 0h24v24H0z" fill="none" />
			<path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
		</svg>
	</button>
);

export default styled(MenuButton)`
	border: none;
	background-color: transparent;
	border-radius: 50%;
	cursor: pointer;
	padding: 8px;
	width: 40px;
	height: 40px;
	margin-right: 10px;
	transition: background-color 200ms cubic-bezier(0.4, 0.0, 0.2, 1);

	svg {
		fill: #fff;
	}

	:hover {
		background-color: rgba(255, 255, 255, 0.2);
	}
`;