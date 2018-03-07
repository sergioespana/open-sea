import { darken } from 'polished';
import styled from 'styled-components';

const ProfileHeader = styled.header`
	color: #ffffff;
	background-color: ${({ theme }) => darken(0.1, theme.primary)};
	margin-bottom: 25px;
	padding: 0 56px;

	section {
		display: flex;
		align-items: flex-end;
		padding-top: 24px 0 0;

		&:first-child {
			padding: 24px 0;
		}

		& > h1,
		& > div {
			padding: 16px 0;
			margin: 0 0 0 24px;
		}

		a {
			:hover {
				text-decoration: none;
			}

			:not(:hover) {
				color: #ffffff;
			}

			* {
				vertical-align: middle;
			}
		}
	}

	img {
		border-radius: 50%;
		width: 130px;
		height: 130px;
		object-fit: contain;
		margin-bottom: -25px;
	}
`;

export default ProfileHeader;