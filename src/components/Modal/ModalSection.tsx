import React, { SFC } from 'react';
import styled from '../../util/styled-components';

const UnstyledModalSection: SFC = ({ ...props }) => <section {...props} />;

export default styled(UnstyledModalSection) `
	padding: 2px 20px;

	& > div:not(:last-child) {
		padding-bottom: 16px;
	}
`;
