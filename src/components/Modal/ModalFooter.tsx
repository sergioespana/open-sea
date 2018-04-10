import React, { SFC } from 'react';
import styled from '../../util/styled-components';

const UnstyledModalFooter: SFC = ({ ...props }) => <footer {...props} />;

export default styled(UnstyledModalFooter)`
	align-items: center;
	display: flex;
	justify-content: flex-end;
	padding: 14px 20px 20px 20px;
`;
