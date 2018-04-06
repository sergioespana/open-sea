import { lighten } from 'polished';
import { css } from 'styled-components';
import appTheme from './theme';

const theme = appTheme.theme;

export default css`
	*,
	*:before,
	*:after {
		box-sizing: border-box;
	}

	*:focus {
		outline: none;
	}

	html, body {
		color: ${theme.text.primary};
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
		font-size: 14px;
		line-height: normal;
		-webkit-font-smoothing: antialiased;
    	-webkit-print-color-adjust: exact;
	}

	body {
		margin: 0;
	}

	#app {
		display: flex;

		& > main {
			flex: auto;
			min-width: 1024px;
		}
	}

	a {
		color: ${theme.text.link};
		text-decoration: none;

		:hover {
			color: ${lighten(0.10, theme.text.link)};
			cursor: pointer;
			text-decoration: underline;
		}
	}

	a, button {
		border-color: transparent;
		border-style: solid;
		border-width: 2px;

		:focus:not(:active) {
			border-color: ${theme.accent};
		}
	}

	h1 {
		font-weight: 500;
		font-size: 1.625rem;
		margin: 0;
	}

	h3 {
		color: ${theme.text.secondary};
		font-size: 0.875rem;
		font-weight: 700;
		margin: 0;
		text-transform: uppercase;
	}
`;
