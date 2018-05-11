import React, { SFC } from 'react';
import styled from '../../util/styled-components';

const UnstyledModalHeader: SFC = ({ ...props }) => <header {...props} />;

export default styled(UnstyledModalHeader)`
	align-items: center;
	display: flex;
	justify-content: space-between;
	padding: 20px 20px 14px 20px;

	& > h1 {
		font-size: 1.42857rem;
	}
`;
