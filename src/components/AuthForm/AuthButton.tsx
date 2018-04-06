import { lighten } from 'polished';
import styled from 'styled-components';

export default styled.button`
	align-items: center;
	background-color: #ffffff;
	border: none;
	box-shadow: 1px 1px 5px 0 rgba(0, 0, 0, 0.2);
	cursor: pointer;
	display: flex;
	font-family: inherit;
	font-size: inherit;
	font-weight: 700;
	height: 39px;
	justify-content: center;
	transition: all 200ms ease;
	will-change: background-color;

	:hover {
		background-color: ${({ theme }) => lighten(0.015, theme.light)};
	}

	:active {
		background-color: ${({ theme }) => theme.light};
	}

	& > img {
		height: 20px;
		margin: 0 6px 0 0;
		width: 20px;
	}
`;
