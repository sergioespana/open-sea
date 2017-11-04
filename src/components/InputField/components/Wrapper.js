import { h } from 'preact';
import styled from 'styled-components';

const Wrapper = styled.div`
	position: relative;
	display: inline-flex;
	flex-direction: column;
	width: ${props => props.fullWidth ? '100%' : 'auto' };
`;

export default Wrapper;