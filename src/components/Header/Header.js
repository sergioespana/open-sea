import React from 'react';
import styled from 'styled-components';

const Header = styled(({ ...props }) => <header {...props} />)`
	padding-bottom: 5px;
	margin: 20px 20px 0 20px;
	display: flex;

	h1 {
		margin: 0;
		font-weight: 500;
		font-size: 1.625rem;
	}
`;

export default Header;