import { h } from 'preact';
import styled from 'styled-components';

const Main = styled.main`
	padding-top: 48px;
	padding-left: ${props => props.hasDrawer ? 255 : 0 }px;
	min-height: 100vh;
`;

export default Main;