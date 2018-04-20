import React, { SFC } from 'react';
import styled from '../../util/styled-components';

const Inner = styled.div`
	position: relative;
`;

const UnstyledFlagGroup: SFC = ({ children, ...props }) => <div {...props}><Inner>{children}</Inner></div>;

const FlagGroup = styled(UnstyledFlagGroup)`
	bottom: 48px;
	left: 80px;
	position: fixed;
	z-index: 600;
`;

export { FlagGroup };
export default FlagGroup;
