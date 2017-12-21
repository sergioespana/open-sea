import { readableColor, mix } from 'polished';
import styled from 'styled-components';

const NavigationMain = styled.div`
	width: 64px;
	flex-shrink: 0;
	flex-grow: 0;
	padding: 16px 0;
	display: ${({ hidden }) => hidden ? 'none' : 'flex'};
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	color: ${({ color, theme }) => theme[color] ? mix(0.2, theme[color], readableColor(theme[color])) : mix(0.2, color, readableColor(color)) };
	background-color: ${({ color, theme }) => theme[color] || color};
	transition: background-color 150ms ease;

	&:not(:first-child) {
		flex: auto;
		width: auto;
		align-items: flex-start;
	}
`;

export default NavigationMain;