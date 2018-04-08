import React, { HTMLProps } from 'react';
import styled from '../../util/styled-components';
import { InputProps } from './Input';

interface FieldProps {
	appearance: InputProps['appearance'];
}
const UnstyledField: React.StatelessComponent<FieldProps & HTMLProps<HTMLInputElement>> = (props) => <input {...props} />;
const Field = styled(UnstyledField)`
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

export { Field };
export default Field;
