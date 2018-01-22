import loading from 'mixins/loading';
import React from 'react';
import styled from 'styled-components';

const Header = styled(({ hidden, loading, ...props }) => !hidden && <header {...props} />)`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	flex: 0 0 64px;

	h1 {
		margin: 0;
		font-weight: 400;
		font-size: 1.8rem;
		cursor: default;
		width: 100%;
		border-radius: 3px;
	}

	// Loading styles
	${(props) => props.loading && loading(0.6)}
`;

export default Header;