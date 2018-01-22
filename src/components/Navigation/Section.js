import get from 'lodash/get';
import isNumber from 'lodash/isNumber';
import React from 'react';
import styled from 'styled-components';

const Section = styled(({ color, bg, width, ...props }) => <section {...props} />)`
	min-width: 64px;
	${({ width }) => isNumber(width) && `width: ${width}px;`}
	height: 100%;
	flex-direction: column;
	color: ${({ color, theme }) => get(theme.text, color) || (color ? color : theme.text.primary)};
	background-color: ${({ bg, theme }) => get(theme, bg) || (bg ? bg : theme.light)};
`;

export default Section;