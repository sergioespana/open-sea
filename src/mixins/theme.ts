import { desaturate, lighten, mix, readableColor, transparentize } from 'polished';

const primary = '#00695C';

export interface ThemeInterface { [key: string]: string; }

export default {
	theme: {
		primary,
		accent: lighten(0.12, primary),
		light: mix(0.02, primary, '#fafafa'),
		muted: desaturate(0.7, primary),
		red: '#DE350B',
		yellow: '#FF991F',
		text: {
			contrast: transparentize(0.1, readableColor(primary)),
			link: '#0052CC',
			primary: mix(0.2, primary, '#242424'),
			secondary: '#707070'
		}
	}
};
