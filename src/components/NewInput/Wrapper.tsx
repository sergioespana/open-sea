import React from 'react';
import styled from '../../util/styled-components';
import { InputProps } from './Input';

interface WrapperProps {
	isCompact?: InputProps['isCompact'];
}
const UnstyledWrapper: React.StatelessComponent<WrapperProps> = (props) => <div {...props} />;
const Wrapper = styled(UnstyledWrapper)`
	max-width: ${({ isCompact }) => isCompact ? '300px' : 'none'};
	width: 100%;
`;

export { Wrapper };
export default Wrapper;
