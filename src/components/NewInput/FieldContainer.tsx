import { darken } from 'polished';
import React, { HTMLProps, SFC } from 'react';
import styled from '../../util/styled-components';
import { InputProps, InputState } from './Input';

interface FieldContainerProps {
	appearance: InputProps['appearance'];
	disabled?: boolean;
	isFocus?: InputState['isFocus'];
}

const getBackgroundColor = (state?: 'hover' | 'active') => (props) => {
	const { appearance = 'default', disabled, isFocus, theme } = props;
	const hover = state === 'hover';

	switch (appearance) {
	case 'default':
		return isFocus ? '#ffffff' : hover && !disabled ? darken(0.05, theme.light) : theme.light;
	case 'inline':
		return hover ? theme.light : isFocus || disabled ? '#ffffff' : 'transparent';
	default:
		return '#ffffff';
	}
};

const getBorderColor = (state?: 'hover' | 'active') => (props) => {
	const { appearance, isFocus, theme } = props;

	switch (appearance) {
	case 'error':
		return theme.red;
	default:
		return isFocus ? theme.accent : 'transparent';
	}
};

const UnstyledFieldContainer: SFC<FieldContainerProps & HTMLProps<HTMLDivElement>> = (props) => <div {...props} />;
const FieldContainer = styled(UnstyledFieldContainer)`
	align-items: center;
	background-color: ${getBackgroundColor()};
	border-color: ${getBorderColor()};
	border-radius: 5px;
	border-style: solid;
	border-width: 2px;
	cursor: ${({ disabled }) => disabled ? 'no-drop' : 'text'};
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	min-height: 38.6px;
	position: relative;
	transition: all 200ms ease;
	width: 100%;
	will-change: background-color, border-color;

	:hover {
		background-color: ${getBackgroundColor('hover')};
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

export { FieldContainer };
export default FieldContainer;
