import { h } from 'preact';
import styled from 'styled-components';

const Hero = styled.header`
	width: 100%;
	height: 250px;
	margin-bottom: 40px;
	text-align: center;
	box-shadow: 0 3px 4px 0 rgba(0,0,0,.14), 0 3px 3px -2px rgba(0,0,0,.2), 0 1px 8px 0 rgba(0,0,0,.12);
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	align-items: center;
	justify-content: center;
`;

export default Hero;