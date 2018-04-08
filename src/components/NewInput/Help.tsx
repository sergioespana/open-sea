import React, { HTMLProps } from 'react';
import styled from '../../util/styled-components';

const UnstyledHelp: React.StatelessComponent<HTMLProps<HTMLParagraphElement>> = (props) => <p {...props} />;
const Help = styled(UnstyledHelp) `
	color: ${({ theme }) => theme.text.secondary};
	font-size: 0.875rem;
	margin: 3px 0 0 7px;
`;

export { Help };
export default Help;
