import { h } from 'preact';
import styled from 'styled-components';

const Overlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 50;
	background-color: rgba(0, 0, 0, 0.5);
`;

export default Overlay;