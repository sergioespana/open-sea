import React, { Component } from 'react';
import isFunction from 'lodash/isFunction';
import linkState from 'linkstate';
import map from 'lodash/map';
import MdClose from 'react-icons/lib/md/close';
import styled from 'styled-components';
import TextField from './TextField';
import uniq from 'lodash/uniq';

const TagContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	flex: 0 0 100%;
`;

const Tag = styled(({ children, onRequestRemove, ...props }) => (
	<span {...props}>
		<span>{ children }</span>
		{ onRequestRemove && <button onClick={onRequestRemove}><MdClose width={14} height={14} /></button> }
	</span>
))`
	display: flex;
	cursor: default;
	height: 20px;
	line-height: 1;
	margin: 4px;
	padding: 0;
	overflow: initial;
	border-radius: 3px;
	color: ${({ theme }) => theme.text.primary};
	background-color: ${({ theme }) => theme.light};

	& > span {
		margin: 0 0 0 4px;
		padding: 2px 0;
		max-width: 180px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	& > button {
		border: none;
		background-color: transparent;
		padding: 0 3px;
		margin: 0;
		border-radius: 3px;
		cursor: pointer;
		display: flex;
		align-items: center;
	}
`;

class TagsField extends Component {
	state = {
		inputValue: ''
	}

	onRequestRemove = (i) => (event) => {
		event.preventDefault();
		const { onChange, value } = this.props;
		if (isFunction(onChange)) onChange({ target: { value: [ ...value.slice(0, i), ...value.slice(i + 1) ] } });
	}

	onKeyPress = (event) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			this.fireOnChange();
		}
	}

	fireOnChange = () => {
		const { inputValue } = this.state;
		const { onChange, value } = this.props;
		if (isFunction(onChange)) onChange({ target: { value: uniq([...value, inputValue]) } });
		this.setState({ inputValue: '' });
	}

	render = () => {
		const { hasRemoveableTags, onChange, onInput, value,  ...props } = this.props;
		const { inputValue } = this.state;

		return (
			<TextField
				{...props}
				hideInputOnBlur
				isInlineEdit
				value={inputValue}
				onChange={linkState(this, 'inputValue')}
				onKeyPress={this.onKeyPress}
			>
				{ value.length > 0 && (
					<TagContainer>
						{ map(value, (text, i) => (
							<Tag
								key={i}
								onRequestRemove={hasRemoveableTags ? this.onRequestRemove(i) : null}
							>{ text }</Tag>
						)) }
					</TagContainer>
				) }
			</TextField>
		);
	}
}

export default TagsField;