import map from 'lodash/map';
import React from 'react';
import styled from 'styled-components';

const Breadcrumbs = styled(({ ...props }) => {
	// TODO: Create a common key generator.
	// FIXME: Right now, keys are regenerated whenever this component rerenders. Don't do that.
	const children = props.children.length > 1
		? map(props.children, (child) => <li key={Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)}>{ child }</li>)
		: <li>{ props.children }</li>;
		
	return <ol {...props}>{ children }</ol>;
})`
	margin: 0 0 10px 0;
	padding: 0;
	list-style: none;

	li {
		padding: 0 10px 0 0;
		display: inline;
		color: ${({ theme }) => theme.text.secondary};
		/* font-size: 0.875rem */;

		a:not(:hover) {
			color: inherit;
		}

		+ li:before {
			content: "/";
			padding-right: 10px;
		}
	}
`;

export default Breadcrumbs;