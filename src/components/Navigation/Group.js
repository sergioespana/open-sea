import loading from 'mixins/loading';
import React from 'react';
import styled from 'styled-components';

const Group = styled(({ hidden, loading, ...props }) => !hidden && <nav {...props} />)`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;

	:not(:first-child):not(:last-child) {
		padding-bottom: 16px;
	}

	// Loading styles
	${(props) => props.loading && loading(0.3)}
`;

export default Group;