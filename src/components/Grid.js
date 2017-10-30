import { h } from 'preact';
import styled from 'styled-components';

const Grid = styled.div`
	display: grid;
	grid-template-columns: ${props => `repeat(${props.cols || 4}, ${100 / (props.cols ? props.cols : 4)}%)`};
	grid-gap: ${props => `${props.gutter || 20}px`};
`;

export default Grid;