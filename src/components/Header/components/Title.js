import { h } from 'preact';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Title = styled.h1`
	margin: 0;
	font-size: 20px;
	font-weight: 300;

	strong {
		font-weight: 400;
	}

	a {
		color: inherit;
		text-decoration: none;
	}
`;

export default Title;