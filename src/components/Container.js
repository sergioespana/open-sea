import { h } from 'preact';
import styled from 'styled-components';

const Container = styled.div`
	margin: ${props => props.slim ? '0 auto' : '0 20px' };
	max-width: ${props => props.slim ? '640px' : 'none' };
	padding: ${props => props.slim ? '0 20px' : 'initial' };
`;

export default Container;