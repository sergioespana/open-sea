import React, { SFC } from 'react';
import styled from '../../util/styled-components';

const UnstyledFlagContent: SFC = (props) => <div {...props} />;

const FlagContent = styled(UnstyledFlagContent) `
	padding: 0 0 0 40px;

	& > div:last-child {
		display: flex;
		padding: 8px 0 0 0;

		a + a {
			margin-left: 15px;
			position: relative;

			:after {
				color: inherit;
				content: '·';
				position: absolute;
				pointer-events: none;
				left: -11px;
			}
		}
	}
`;

export { FlagContent };
export default FlagContent;
