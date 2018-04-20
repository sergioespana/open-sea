import React, { SFC } from 'react';
import styled from '../../util/styled-components';

const UnstyledFlagHeader: SFC = (props) => <div {...props} />;

const FlagHeader = styled(UnstyledFlagHeader)`
	align-items: center;
	display: flex;
	height: 32px;

	& > div {
		flex: 0 0 auto;
		width: 40px;
	}

	& > span {
		flex: 1 1 0%;
		font-weight: 600;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	& > button {
		background-color: transparent;
		border: none;
		color: inherit;
		cursor: pointer;
	}
`;

export { FlagHeader };
export default FlagHeader;
