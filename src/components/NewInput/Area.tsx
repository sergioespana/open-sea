import React, { HTMLProps } from 'react';
import styled from '../../util/styled-components';
import { InputProps } from './Input';

interface AreaProps {
	appearance: InputProps['appearance'];
}
const UnstyledArea: React.StatelessComponent<AreaProps & HTMLProps<HTMLTextAreaElement>> = (props) => <textarea {...props} />;
const Area = styled(UnstyledArea)`
	background-color: transparent;
	border: none;
	color: ${({ theme }) => theme.text.primary};
	font-family: inherit;
	font-size: inherit;
	padding: 8px 7px;
	resize: none;
	width: 100%;

	:hover {
		cursor: text;
	}

	:focus {
		outline: none;
	}

	&::placeholder {
		color: ${({ theme }) => theme.text.secondary};
		${({ appearance, disabled }) => (appearance === 'inline' && disabled) && 'font-style: italic;'}
		opacity: 1;
	}
`;

export { Area };
export default Area;
