import { css } from 'styled-components';

const loading = (opacity = 0.3) => css`
	pointer-events: none;
	opacity: ${opacity};

	a,
	button {
		background-color: transparent !important;
	}
	
	svg,
	span,
	img,
	h1 {
		background-color: currentColor;
		text-indent: 100%;
		overflow: hidden;
		
		& > * {
			visibility: hidden;
		}
	}

	img {
		border-radius: 6px;
	}

	h1 {
		height: 18px;
	}
`;

export default loading;