import { h } from 'preact';
import styled from 'styled-components';

const Wrapper = styled.aside`
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	width: 280px;
	background-color: #fff;
	padding-top: 48px;
	box-shadow: 0 16px 24px 2px rgba(0,0,0,0.14), 0 6px 30px 5px rgba(0,0,0,0.12), 0 8px 10px -5px rgba(0,0,0,0.2);
	z-index: 11;
	transition: ${props => props.open ? 'transform 195ms cubic-bezier(0.0, 0.0, 0.2, 1)' : 'transform 225ms cubic-bezier(0.4, 0.0, 0.2, 1)' };
	transform: ${props => props.open ? 'translate3d(0, 0, 0)' : 'translate3d(-110%, 0, 0)' };
`;

export default Wrapper;