import { h } from 'preact';
import styled from 'styled-components';

const BottomLabel = styled.p`
	color: ${props => props.disabled ? 'rgba(0, 0, 0, 0.42);' : props.error ? '#ff1744' : 'rgba(0, 0, 0, 0.54)' };
	margin: 0;
	font-size: 12px;
	text-align: left;
	margin-top: 8px;
`;

export default BottomLabel;