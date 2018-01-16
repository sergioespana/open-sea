import React from 'react';
import styled from 'styled-components';

const Header = styled((props) => {
	const { children, secondary, ...rest } = props;

	return (
		<header {...rest}>
			<div>{ children }</div>
			{ secondary && <div>{ secondary }</div> }
		</header>
	);
})`
	padding-bottom: 5px;
	margin: 20px 20px 0 20px;
	display: flex;

	h1 {
		margin: 0;
		font-weight: 500;
		font-size: 1.5rem;
	}

	& > div:first-of-type {
		flex: auto;
	}
`;

export default Header;