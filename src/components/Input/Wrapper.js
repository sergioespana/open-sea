import React from 'react';
import styled from 'styled-components';

const Wrapper = styled(({ ...props }) => <div {...props} />)`
	display: flex;
	flex-direction: column;
	width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};

	&:not(:last-of-type) {
		margin-bottom: 16px;
	}

	&:first-of-type {
		margin-top: 16px;
	}
`;

export default Wrapper;