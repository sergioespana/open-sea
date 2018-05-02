import React, { HTMLProps } from 'react';
import styled from '../../util/styled-components';
import { InputProps } from './Input';

interface IHelp {
	appearance: InputProps['appearance'];
}

const getColor = ({ appearance, theme }) => {
	switch (appearance) {
	case 'error':
		return theme.red;
	case 'warning':
		return theme.yellow;
	default:
		return theme.text.secondary;
	}
};

const UnstyledHelp: React.StatelessComponent<IHelp & HTMLProps<HTMLParagraphElement>> = (props) => <p {...props} />;
const Help = styled(UnstyledHelp) `
	color: ${getColor};
	font-size: 0.875rem;
	margin: 3px 0 0 0;
`;

export { Help };
export default Help;
