import { darken, transparentize } from 'polished';
import styled from '../util/styled-components';

export default styled.div`
	align-items: center;
	background-color: ${({ theme }) => darken(0.125, transparentize(0.45, theme.primary))};
	bottom: 0;
	display: flex;
	justify-content: center;
	left: 0;
	opacity: ${({ animationState }) => animationState === 'exited' || animationState === 'exiting' ? 0 : 1};
	position: fixed;
	right: 0;
	top: 0;
	transition: opacity 200ms ease;
	z-index: 10;
`;
