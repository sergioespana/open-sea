import React, { HTMLProps, SFC } from 'react';
import styled from '../util/styled-components';

const FormActions = styled.div`
	display: flex;
	flex-wrap: nowrap;

	& > * {
		margin-right: 8px;
	}
`;

interface IForm {
	isStandalone?: boolean;
}

const UnstyledForm: SFC<IForm & HTMLProps<HTMLFormElement>> = (props) => <form {...props} />;
const Form = styled(UnstyledForm)`
	margin: ${({ isStandalone }) => isStandalone ? '60px' : 0} auto 0 auto;
	max-width: 700px;
	width: 100%;

	& > * {
		margin-bottom: 24px;
	}

	& > footer {
		margin-top: 48px;
	}
`;

export { Form, FormActions };
export default Form;
