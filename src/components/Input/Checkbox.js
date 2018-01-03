import React from 'react';
import Wrapper from './Wrapper';

const CheckboxWrapper = Wrapper.extend`
	align-items: center;
	margin-top: 6px;

	input {
		margin: 0 6px 0 0;
	}
`;

const Checkbox = ({ className, help, ...props }) => (
	<CheckboxWrapper className={className}>
		<input type="checkbox" {...props} />
		<label htmlFor={props.id}>{ help }</label>
	</CheckboxWrapper>
);

export default Checkbox;