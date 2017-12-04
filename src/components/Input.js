import React, { createElement } from 'react';
import TagsInput from 'components/TagsInput';

const Input = ({ ...props }) => {
	const type = props.type;

	if (type === 'text') return createElement('textarea', { ...props, rows: 4, cols: 50 });

	if (type === 'likert') return createElement(
		'fieldset',
		props,
		<label><input type="radio" value="1" /> 1</label>,
		<label><input type="radio" value="2" /> 2</label>,
		<label><input type="radio" value="3" /> 3</label>,
		<label><input type="radio" value="4" /> 4</label>,
		<label><input type="radio" value="5" /> 5</label>
	);

	if (type === 'list') return createElement(TagsInput, props);
	
	return createElement('input', props);
};

export default Input;