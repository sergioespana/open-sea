import { h } from 'preact';
import styled from 'styled-components';

const Wrapper = styled.div`
	position: relative;
	background-color: transparent;
	font-size: 14px;
	height: 36px;
	padding: 0 24px 0 8px;
	border: none;
	border-radius: 2px;
	cursor: pointer;
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	align-items: center;

	:hover {
		background-color: rgba(255, 255, 255, 0.2);
	}
`;

export default Wrapper;