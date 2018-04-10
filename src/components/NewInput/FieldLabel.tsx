import React, { HTMLProps } from 'react';
import styled from '../../util/styled-components';

const UnstyledFieldLabel: React.StatelessComponent<HTMLProps<HTMLLabelElement>> = (props) => <label {...props} />;
const FieldLabel = styled(UnstyledFieldLabel)`
	color: ${({ theme }) => theme.text.secondary};
	font-size: 0.857rem;
	font-weight: 500;
	margin: 0px auto 0px 0px;
	padding: 0 0 3px 0;
	position: relative;

	&[required]:not([required="false"]) {
		:after {
			color: ${({ theme }) => theme.red};
			content: '*';
			left: 103%;
			position: absolute;
		}
	}
`;

export { FieldLabel };
export default FieldLabel;
