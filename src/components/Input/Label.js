import { createElement } from 'react';
import isString from 'lodash/isString';
import styled from 'styled-components';

const Label = styled(({ ...props }) => createElement(props.htmlFor || !isString(props.children) ? 'label' : 'legend', { ...props }))`
	font-size: 0.857rem;
	color: ${({ theme }) => theme.text.secondary};
	font-weight: 500;
	margin: 0 auto 0 9px;
	padding-bottom: 3px;
	position: relative;

	&[required]:after {
		content: '*';
		position: absolute;
		top: 0;
		margin-left: 2px;
		color: red;
	}
`;

export default Label;