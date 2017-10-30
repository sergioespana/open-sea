import { h } from 'preact';
import styled from 'styled-components';

const Icon = (props) => (
	<svg {...props} height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
		<path d="M7 10l5 5 5-5z"/>
		<path d="M0 0h24v24H0z" fill="none"/>
	</svg>
);

export default styled(Icon)`
	position: absolute;
	right: 0;
	pointer-events: none;
	fill: #fff;
	width: 18px;
	height: 18px;
`;