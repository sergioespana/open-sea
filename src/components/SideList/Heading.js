import React from 'react';
import styled from 'styled-components';

const Heading = styled(({ ...props }) => <div {...props} />) `
	text-transform: uppercase;
	font-size: 0.75rem;
	font-weight: 700;
	color: #707070;
	padding: 10px 10px 4px;

	:first-child {
		padding-top: 0;
	}

	:not(:first-of-type) {
		border-top: 1px solid #ccc;
		margin-top: 5px;
	}
`;

export default Heading;