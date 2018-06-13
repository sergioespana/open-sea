import React, { HTMLProps, SFC } from 'react';
import styled from '../util/styled-components';

const UnstyledProgress: SFC<HTMLProps<HTMLProgressElement>> = (props) => <progress {...props} />;
const Progress = styled(UnstyledProgress)`
	appearance: none;
	width: 100%;

	&::-webkit-progress-bar {
		background-color: #eee;
		border-radius: 3px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25) inset;
	}

	&::-webkit-progress-value {
		background-color: ${({ theme }) => theme.primary};
		border-radius: 3px;
	}
`;

export { Progress };
export default Progress;
