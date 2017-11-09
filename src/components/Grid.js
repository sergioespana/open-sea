import { h } from 'preact';
import styled from 'styled-components';

const Grid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(${props => props.childMinWidth || 250}px, 1fr));
	grid-gap: ${props => props.gutter || 20}px;
	grid-auto-flow: dense;
	padding-top: ${props => props.gutter || 20}px;
	padding-bottom: ${props => props.gutter || 20}px;
`;

export default Grid;