import { h } from 'preact';
import styled from 'styled-components';

const Container = styled.div`
	margin: ${props => props.slim ? '0 auto' : '0 20px' };
	max-width: ${props => props.slim ? '640px' : 'none' };
	
	@media (min-width: 1025px) {
		margin: ${props => props.slim ? '0 auto' : '0 96px' };
	}
`;

export default Container;