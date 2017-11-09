import { h } from 'preact';
import styled from 'styled-components';

const Container = styled.div`
	margin: 0 20px;
	
	@media (min-width: 1025px) {
		margin: 0 96px;
	}

	${props => props.slim && `
		@media (min-width: 697px) {
			margin: 0 auto;
			max-width: 640px;
		}
	`};

	${props => props.medium && `
		@media (min-width: 957px) {
			margin: 0 auto;
			max-width: 900px;
		}
	`};
`;

export default Container;