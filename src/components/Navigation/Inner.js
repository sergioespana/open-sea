import React from 'react';
import styled from 'styled-components';

const Inner = styled(({ ...props }) => <div {...props} />)`
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 16px 0;
	height: 100%;
`;

export default Inner;