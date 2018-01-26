import React, { Children, cloneElement } from 'react';
import styled from 'styled-components';

const HiddenOnPrint = styled(({ children, className, reverse, ...props }) => Children.map(children, (child) => cloneElement(child, { className })))`
	@media screen {
		${({ reverse }) => reverse && `display: none !important;`}
	}

	@media print {
		${({ reverse }) => !reverse && `display: none !important;`}
	}
`;

export default HiddenOnPrint;