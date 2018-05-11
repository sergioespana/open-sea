import styled from 'styled-components';

export const Expander = styled.div`
	cursor: ew-resize;
	height: 100%;
	position: absolute;
	right: -6px;
	top: 0;
	width: 12px;

	:before {
		background-color: ${({ theme }) => theme.accent};
		content: '';
		height: 100%;
		left: 5px;
		opacity: 0;
		position: absolute;
		transition: background-color 250ms ease;
		width: 2px;
	}

	&:hover:before,
	&:hover > button {
		opacity: 1;
	}
`;

interface ExpanderButtonProps {
	expanded?: boolean;
}
export const ExpanderButton = styled<ExpanderButtonProps, 'button'>('button') `
	background: none;
	border: none;
	cursor: pointer;
	height: 36px;
	left: 0;
	opacity: 0;
	position: relative;
	top: calc(50% - 18px);
	width: 24px;

	:before,
	:after {
		background-color: ${({ theme }) => theme.accent};
		border-radius: 16px;
		content: '';
		height: 8px;
		left: 13px;
		position: absolute;
		transform: rotate(0deg);
		transition: transform 250ms ease;
		width: 2.5px;
	}

	:before {
		top: 10px;
		transform-origin: 1px 7px;
	}

	:after {
		top: 16px;
		transform-origin: 1px 1px;
	}

	:hover:before {
		transform: ${({ expanded }) => `rotate(${expanded ? 40 : -40}deg)`};
	}

	:hover:after {
		transform: ${({ expanded }) => `rotate(${expanded ? -40 : 40}deg)`};
	}
`;
