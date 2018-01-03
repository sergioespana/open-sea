import { lighten, textInputs } from 'polished';
import styled from 'styled-components';

const Wrapper = styled.div`
	display: flex;
	flex-wrap: wrap;

	& > ${textInputs()},
	& > fieldset {
		flex: 250px;
		flex-shrink: 0;
		flex-grow: 1;
		font-family: inherit;
		font-size: inherit;

		&[disabled] {
			color: initial;
			background-color: transparent;
			border: none;
		}
	}

	& > ${textInputs()} {
		min-height: 32px;
		background-color: #fafbfc;
		border: 1px solid #ccc;
		border-radius: 3px;
		padding: 4px 5px;

		:not([disabled]):active,
		:not([disabled]):focus {
			box-shadow: 0 0 0 2px ${({ theme }) => lighten(0.17, theme.primary)} inset;
		}

		[disabled] {
			background-color: transparent;
			color: initial;
		}
	}
`;

export default Wrapper;