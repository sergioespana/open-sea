import styled from 'styled-components';

export default styled.th`
	& > span,
	& > a {
		align-items: center;
		height: 100%;
		display: inline-flex;
		padding: 7px 10px;
		width: 100%;

		:focus {
			border-color: transparent !important;
		}
	}

	& > a {
		color: inherit;

		:hover,
		&[aria-current="true"] {
			background-color: ${({ theme }) => theme.light};
			color: inherit;
			text-decoration: none;
		}
	}
`;
