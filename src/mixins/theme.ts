import { desaturate, lighten, mix, readableColor, transparentize } from 'polished';

const primary = '#00695C';

// TODO: Remove 'any' option once below TODO is done.
export interface ThemeInterface { [key: string]: string | any; }

// TODO: Move 'text' field to within the main theme object.
const theme: ThemeInterface = {
	primary,
	accent: lighten(0.12, primary),
	light: mix(0.02, primary, '#fafafa'),
	muted: desaturate(0.7, primary),
	red: '#DE350B',
	yellow: '#FF991F',
	green: '#00875A',
	text: {
		contrast: transparentize(0.1, readableColor(primary)),
		link: '#0052CC',
		primary: mix(0.2, primary, '#242424'),
		secondary: '#707070'
	}
};

export default { theme };
