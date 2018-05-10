import { Button as NavButton } from '../Navigation/Button';

export default NavButton.extend`
	&,
	&[aria-current]:not([aria-current="false"]) {
		background-color: #ffffff;
		color: ${({ theme }) => theme.text.primary};

		:hover {
			background-color: ${({ theme }) => theme.light};
			color: ${({ theme }) => theme.text.primary};
		}
	}

	&[disabled]:not([disabled="false"]) {
		pointer-events: none;
	}

	img {
		border-radius: 50%;
	}
`;
