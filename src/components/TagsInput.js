import React, { Component } from 'react';
import { injectGlobal } from 'styled-components';
import styles from 'react-tagsinput/react-tagsinput.css';
import TagsField from 'react-tagsinput';

// Workaround, usage of this library is temporary anyway
injectGlobal`
	${styles}

	.react-tagsinput {
		border: 1px solid grey;
	}
`;

export default class TagsInput extends Component {
	onChange = (tags) => {
		this.props.onChange({ target: { value: tags } });
	}

	render() {
		const { value, onChange, ...props } = this.props,
			state = this.state;
		
		return (
			<TagsField
				value={value || []}
				onChange={this.onChange}
				{...props}
			/>);
	}
}