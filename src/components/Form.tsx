import React, { HTMLProps, SFC } from 'react';
import styled from '../util/styled-components';

const FormActions = styled.div`
	display: flex;
	flex-wrap: nowrap;

	& > * {
		margin-right: 8px;
	}
`;

interface FormProps {
	isStandalone?: boolean;
}

const UnstyledForm: SFC<FormProps & HTMLProps<HTMLFormElement>> = (props) => <form {...props} />;
const Form = styled(UnstyledForm)`
	margin: ${({ isStandalone }) => isStandalone ? '60px' : 0} auto 0 auto;
	max-width: 640px;
	width: 100%;

	& > * {
		margin-bottom: 24px;
	}
`;

export { Form, FormActions };
export default Form;
