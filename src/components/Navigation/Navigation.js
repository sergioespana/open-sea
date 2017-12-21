import Expander from './NavigationExpander';
import React from 'react';
import styled from 'styled-components';

const Navigation = styled((props) => {
	const { children, className, expanded, toggleExpanded } = props,
		baseProps = { className },
		expanderProps = { expanded, toggleExpanded };
	return (
		<aside {...baseProps}>
			{ children }
			{ toggleExpanded && <Expander {...expanderProps} /> }
		</aside>
	);
})`
	display: flex;
	width: auto;
    flex-shrink: 0;
	position: relative;

	& > :not(:first-child):not(:last-child) {
		${({ expanded }) => !expanded && `display: none;`}
	}
`;

export default Navigation;