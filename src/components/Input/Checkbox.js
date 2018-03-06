import Help from './Help';
import Label from './Label';
import React from 'react';
import styled from 'styled-components';
import Wrapper from './Wrapper';

const BoxLabel = styled.label`
	display: flex;
	align-items: center;

	span {
		margin-left: 4px;
	}
`;

const Checkbox = styled(({ className, help, label, secondLabel, ...props }) => (
	<Wrapper className={className}>
		<Label required={props.required}>{ label }</Label>
		<BoxLabel>
			<input type="checkbox" {...props} />
			<span>{ secondLabel }</span>
		</BoxLabel>
		<Help>{ help }</Help>
	</Wrapper>
))``;

export default Checkbox;