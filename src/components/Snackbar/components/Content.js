import { h } from 'preact';
import styled from 'styled-components';

const Content = styled.span`
	flex: 100%;
	padding: ${props => props.children.length > 45 ? '24px 0' : '14px 0' };

	@media (min-width: 601px) {
		padding: 14px 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
`;

export default Content;