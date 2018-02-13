import styled, { keyframes } from 'styled-components';
import React from 'react';

const outerSpinner = keyframes`
	0% {
		transform: rotate(50deg);
	}
	100% {
		transform: rotate(230deg);
	}
`;

const innerSpinner = keyframes`
	100% {
		transform: rotate(360deg);
	}
`;

const Spinner = styled(({ size = 20, ...props }) => (
	<div {...props}>
		<div>
			<svg height={size} size={size} viewBox={`0 0 ${size} ${size}`} width={size}>
				<circle cx={size * 0.5} cy={size * 0.5} r={size * 0.5 - size * 0.05} />
			</svg>
		</div>
	</div>
))`
	& > div {
		height: 20px;
		width: 20px;
		animation: ${outerSpinner} 1s ease-in-out forwards;

		svg {
			fill: none;
			stroke: #ffffff;
			stroke-dasharray: 56.548667764616276px;
			stroke-dashoffset: 45.23893421169302px;
			stroke-linecap: round;
			stroke-width: 2px;
			animation: ${innerSpinner} 0.86s cubic-bezier(0.4, 0.15, 0.6, 0.85) infinite;
		}
	}
`;

export default Spinner;