import React from 'react';
import styled from 'styled-components';

const Expander = styled(({ expanded, toggle, ...props }) => (
	<div {...props}>
		<button onClick={toggle} aria-expanded={expanded} />
	</div>
))`
	position: absolute;
	width: 12px;
	height: 100%;
	top: 0;
	right: -6px;
	cursor: ew-resize;

	:before {
		content: '';
		position: absolute;
		width: 2px;
		height: 100%;
		left: 5px;
		transition: background-color 250ms ease;
	}

	button {
		position: relative;
		top: calc(50% - 18px);
		height: 36px;
		background: none;
		border: none;
		color: transparent;
		width: 24px;
		left: 0;
		cursor: pointer;
		opacity: 0;
		transition: opacity 300ms ease-in-out;

		:before,
		:after {
			content: '';
			background-color: ${({ theme }) => theme.accent};
			width: 2.5px;
			border-radius: 16px;
			height: 8px;
			position: absolute;
			left: 13px;
			transition: transform 250ms ease;
			transform: rotate(0deg);
		}

		:before {
			top: 10px;
			transform-origin: 1px 7px;
		}

		:after {
			top: 16px;
			transform-origin: 1px 1px;
		}

		:hover:before,
		:focus:before {
			transform: rotate(${({ expanded }) => expanded ? 40 : -40}deg);
		}

		:hover:after,
		:focus:after {
			transform: rotate(${({ expanded }) => expanded ? -40 : 40}deg);
		}
	}

	:hover {
		:before {
			background-color: ${({ theme }) => theme.accent};
		}

		button {
			opacity: 1;
		}
	}
`;

export default Expander;