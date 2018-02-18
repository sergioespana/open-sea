import { lighten, mix, readableColor, transparentize } from 'polished';

const primary = '#00695C';

const theme = {
	primary,
	light: mix(0.02, primary, '#fafafa'),
	accent: lighten(0.12, primary),
	text: {
		primary: mix(0.2, primary, '#242424'),
		secondary: '#707070',
		contrast: transparentize(0.1, readableColor(primary))
	}
};

export default theme;