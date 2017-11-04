import { h } from 'preact';
import styled from 'styled-components';

const FloatingLabel = styled.label`
	position: absolute;
	top: 0;
	left: 0;
	color: ${props => props.disabled ? 'rgba(0, 0, 0, 0.42)' : props.error ? '#ff1744' : props.focus ? '#2962ff' : 'rgba(0, 0, 0, 0.54)' };
    padding: 0;
	transform-origin: top left;
	transform: ${props => props.shrink ? 'translate(0, 1.5px) scale(0.75)' : 'translate3d(0, 23px, 0) scale(1)' };
	transition: transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms;
`;

export default FloatingLabel;