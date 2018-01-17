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

	h3 {
		color: ${({ theme }) => theme.text.secondary};
		font-weight: 700;
		font-size: 0.75rem;
		text-transform: uppercase;
		padding: 7px 10px;
		margin: 0;
		width: 100%;

		&:not(:first-child) {
			margin-top: 5px;
			border-top: 1px solid #ccc;
		}
	}

	// Loading styles
	${(props) => props.loading && loading(0.3)}
`;

export default Group;