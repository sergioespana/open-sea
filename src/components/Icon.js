import { h } from 'preact';

const Icon = ({ icon }) => {
	let split = icon.split('-'),
		category = split[0].toLowerCase(),
		name = split.slice(1, split.length).join('_'),
		path = `material-design-icons/${category}/svg/production/ic_${name}_24px.svg`,
		svg = null;
	return svg;
};

export default Icon;