import React, { createElement } from 'react';
import styled from 'styled-components';

const InputLabel = styled(({ component = 'label', ...props }) => createElement(component, props)) `
	color: #707070;
	width: 145px;
	flex-shrink: 0;
	padding: 0;
	margin: 6px 16px 0 0;
	font-size: inherit;
	text-align: right;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: flex-end;
`;

export default InputLabel;