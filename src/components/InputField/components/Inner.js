import { h } from 'preact';
import styled from 'styled-components';

const Inner = styled.div`
	margin-top: 16px;
	display: inline-flex;
	position: relative;
	align-items: baseline;
	width: 100%;
	pointer-events: ${props => props.disabled ? 'none' : 'all' };

	:before {
		left: 0;
		right: 0;
		bottom: 0;
		height: ${props => props.focus ? 2 : 1 }px;
		content: "";
		position: absolute;
		transition: background-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
		pointer-events: none;
		background-color: ${props => props.focus ? 'rgba(0, 0, 0, 0.87)' : 'rgba(0, 0, 0, 0.42)' };

		${props => props.disabled ? `
			background: transparent;
			background-size: 5px 1px;
			background-image: linear-gradient(to right, rgba(0, 0, 0, 0.42) 33%, transparent 0%);
			background-repeat: repeat-x;
			background-position: left top;
		` : null}
	}

	:hover {
		:before {
			height: 2px;
			background-color: rgba(0, 0, 0, 0.87);
		}
	}

	:after {
		left: 0;
		right: 0;
		bottom: 0;
		height: 2px;
		content: "";
		position: absolute;
		transform: ${props => props.focus ? 'scaleX(1)' : 'scaleX(0)'};
		transition: transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms;
		pointer-events: none;
		background-color: ${props => props.error ? '#ff1744' : '#2962ff'};
	}
`;

export default Inner;