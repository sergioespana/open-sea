import styled from 'styled-components';

const AuthForm = styled.form`
	color: ${({ theme }) => theme.text.contrast};
	background-color: ${({ theme }) => theme.primary};
	height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;

	header {
		padding: 48px 0 0 0;
		text-align: center;

		h1 {
			margin: 0;

			&:first-child {
				font-size: 3rem;
				font-weight: 300;
				margin-bottom: 2rem;
			}
		}
	}

	section {
		margin: 48px 0;

		& > div:first-child {
			background-color: #ffffff;
			border-radius: 3px;
			padding: 48px;
			box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
			max-width: 400px;

			*:not(:last-child) {
				margin-bottom: 24px;
			}
		}

		& > div:not(:first-child) {
			margin-top: 48px;
			text-align: center;

			a {
				color: inherit;
			}
		}

		p,
		p a {
			color: ${({ theme }) => theme.text.secondary};
			font-size: 0.875rem;

			a {
				text-decoration: underline;
			}
		}

		button {
			height: 39px;
			width: 100%;
		}
	}

	footer {
		margin: auto 0 0;
		padding: 0 0 32px 0;

		& > a {
			color: #ffffff;
		}
	}
`;

export default AuthForm;