import { h } from 'preact';
import styled from 'styled-components';

const Wrapper = styled.header`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	height: 48px;
	padding: 0 20px;
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	align-items: center;
	background-color: rgb(59, 120, 231);
	z-index: 10;
	box-shadow: 0 3px 4px 0 rgba(0,0,0,.14), 0 3px 3px -2px rgba(0,0,0,.2), 0 1px 8px 0 rgba(0,0,0,.12);
	color: #fff;
`;

export default Wrapper;