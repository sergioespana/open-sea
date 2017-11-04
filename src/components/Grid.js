import { h } from 'preact';
import styled from 'styled-components';

const Grid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, calc(25% - ${props => `${props.gutter || 20}px`}));
	grid-gap: ${props => `${props.gutter || 20}px`};
`;

export default Grid;