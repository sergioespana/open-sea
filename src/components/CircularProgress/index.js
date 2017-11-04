import { h } from 'preact';
import styled from 'styled-components';

const CircularProgress = ({ children, centerParent, ...props }) => (
	<div {...props}>
		<svg viewBox="0 0 50 50">
			<circle cx="25" cy="25" r="20" fill="none" stroke-width="3.6" />
		</svg>
	</div>
);

export default styled(CircularProgress)`
	position: ${props => props.centerParent ? 'absolute' : 'relative' };
	top: ${props => props.centerParent ? '50%' : 'auto' };
	left: ${props => props.centerParent ? '50%' : 'auto' };
	transform: ${props => props.centerParent ? 'translate3d(-50%, 0, 0)' : 'none' };
	width: 40px;
	height: 40px;
	color: #2196f3;

	svg {
		animation: rotate 1.4s linear infinite;

		circle {
			animation: circular-dash 1.4s ease-in-out infinite;
			stroke-dasharray: 80,200;
			stroke-dashoffset: 0;
			stroke: #2196f3;
			stroke-linecap: round;
		}
	}

	@keyframes rotate {
		100% {
			transform: rotate(360deg);
		}
	}

	@keyframes circular-dash {
		0% {
			stroke-dasharray: 1,200;
			stroke-dashoffset: 0;
		}
		50% {
			stroke-dasharray: 100,200;
			stroke-dashoffset: 15;
		}
		100% {
			stroke-dasharray: 1,200;
			stroke-dashoffset: -120;
		}
	}
`;