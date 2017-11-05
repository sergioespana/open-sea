import { h } from 'preact';
import styled from 'styled-components';

const ItemTitleWrapper = styled.div`
	display: flex;
	flex-direction: column;
	flex: auto;

	:not(:first-child) {
		margin-left: 16px;
	}
`;

export default ItemTitleWrapper;