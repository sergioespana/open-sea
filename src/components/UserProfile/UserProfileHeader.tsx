import styled from 'styled-components';

export default styled.header`
    background-color: ${({ theme }) => theme.muted};
	color: #ffffff;
    margin-bottom: 25px;
    padding: 0px 56px;

	a {
		&:not(:hover) {
			color: inherit;
		}

		&:hover {
			text-decoration: none;
		}
	}

	& > section {
		margin: 0 auto;
		max-width: 800px;
		padding: 0 20px;

		&:first-child {
			padding-bottom: 24px;
			padding-top: 24px;
		}

		&:last-child {
			align-items: flex-end;
			display: flex;

			& > img {
				border-radius: 50%;
				height: 130px;
				margin-bottom: -25px;
				width: 130px;
			}

			& > h1,
			& > div {
				margin: 0px 0px 0px 24px;
				padding: 16px 0px;
			}
		}
	}
`;
