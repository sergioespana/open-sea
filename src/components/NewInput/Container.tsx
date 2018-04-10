import { darken } from 'polished';
import React, { HTMLProps } from 'react';
import styled from '../../util/styled-components';
import { InputProps, InputState } from './Input';

interface ContainerProps {
	appearance: InputProps['appearance'];
	disabled?: boolean;
	isFocus?: InputState['isFocus'];
}
const UnstyledContainer: React.StatelessComponent<ContainerProps & HTMLProps<HTMLDivElement>> = (props) => <div {...props} />;
const Container = styled(UnstyledContainer)`
	align-items: center;
	background-color: ${({ appearance, isFocus, theme }) => appearance === 'inline' || isFocus ? '#ffffff' : theme.light};
	border-color: ${({ isFocus, theme }) => isFocus ? theme.accent : 'transparent'};
	border-radius: 5px;
	border-style: solid;
	border-width: 2px;
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	min-height: 38.6px;
	position: relative;
	transition: all 200ms ease;
	width: 100%;
	will-change: background-color, border-color;

	:hover {
		background-color: ${({ appearance, disabled, isFocus, theme }) => (appearance === 'inline' && disabled) || isFocus ? '#ffffff' : appearance === 'inline' && !disabled ? theme.light : darken(0.05, theme.light)};
	}

	& > svg {
		height: 24px;
		margin: 0 14px;
		width: 24px;

		& + input {
			padding-left: 0;
		}
	}

	& > input + svg {
		margin-left: 7px;
	}
`;

export { Container };
export default Container;
