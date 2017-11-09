import { h } from 'preact';
import styled from 'styled-components';

const Wrapper = styled.div`
	position: ${props => props.inline ? 'relative' : 'absolute' };
	z-index: ${props => props.inline ? 'auto' : 10 };
	top: ${props => props.pos ? `${props.pos.y}px` : 0 };
	left: ${props => props.pos ? `${props.pos.x}px` : 0 };
	background-color: #fff;
	border-radius: 2px;
	box-shadow: ${props => props.inline ? 'none' : '0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2)' };
	padding: 24px 0;
	transform-origin: 0px 0px;
	animation-name: ${props => props.inline ? 'none' : 'menuAppear' };
	animation-duration: 300ms;
	animation-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);

	
	:not(:last-child) {
		border-bottom: 1px solid #e8e8e8;
	}

	@keyframes menuAppear {
		from { 
			opacity: 0;
			transform: scale(0.7, 0.7);
		}
		to {
			opacity: 1;
			transform: scale(1, 1);
		}
	}
`;

export default Wrapper;