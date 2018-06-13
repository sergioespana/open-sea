import React, { HTMLProps, SFC } from 'react';
import styled from '../util/styled-components';

const UnstyledProgress: SFC<HTMLProps<HTMLProgressElement>> = (props) => <progress {...props} />;
const Progress = styled(UnstyledProgress)`
	appearance: none;
	height: 6px;
	width: 100%;

	&::-webkit-progress-bar {
		background-color: ${({ theme }) => theme.light};
		border-radius: 6px;
	}

	&::-webkit-progress-value {
		background-color: ${({ theme }) => theme.primary};
		border-radius: 6px;
	}
`;

export { Progress };
export default Progress;
