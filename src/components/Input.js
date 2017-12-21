import { lighten } from 'polished';
import React from 'react';
import slug from 'slug';
import styled from 'styled-components';
import TagsInput from 'components/TagsInput';

const CheckboxWrapper = styled.div`
	display: flex;
	align-items: center;
	height: 32px;

	input {
		margin: 0 10px 0 0;
	}
`;

const createFormElement = ({ help, label, options, src, type, ...props }) => {
	props.id = slug(`id-${label}`).toLowerCase();
	
	switch (type) {
		case 'checkbox':
			return (
				<React.Fragment>
					<legend>{ label }</legend>
					<CheckboxWrapper>
						<input type="checkbox" {...props} />
						<label htmlFor={props.id}>{ help }</label>
					</CheckboxWrapper>
				</React.Fragment>
			);

		case 'image':
			return (
				<React.Fragment>
					<legend>{ label }</legend>
					<label>
						{ src && <img src={src} /> }
						<div>Change { label.toLowerCase() }</div>
						<input type="file" {...props} />
					</label>
				</React.Fragment>
			);

		case 'likert':
			return (
				<React.Fragment>
					<legend>{ label }</legend>
					<fieldset>
						{ Array(5).fill({}).map((item, index) => (
							<label><input type="radio" name={props.id} /> { index + 1 }</label>
						)) }
					</fieldset>
					{ help && <p>{ help }</p> }
				</React.Fragment>
			);

		case 'list':
			return (
				<React.Fragment>
					<label htmlFor={props.id}>{ label }</label>
					<TagsInput {...props} />
					{ help && <p>{ help }</p> }
				</React.Fragment>
			);

		case 'select':
			return (
				<React.Fragment>
					<legend>{ label }</legend>
					<select {...props}>
						<option value="" />
						{ options.map((option) => <option value={option.value}>{ option.text }</option>) }
					</select>
					{ help && <p>{ help }</p> }
				</React.Fragment>
			);
				
		case 'text':
			return (
				<React.Fragment>
					<label htmlFor={props.id}>{ label }</label>
					<textarea rows={4} cols={40} {...props} />
					{ help && <p>{ help }</p> }
				</React.Fragment>
			);
	
		default:
			return (
				<React.Fragment>
					<label htmlFor={props.id}>{ label }</label>
					<input type={type || 'text'} {...props} />
					{ help && <p>{ help }</p> }
				</React.Fragment>
			);
	}
};

const Input = styled(({ className, ...props }) => (
	<div className={className}>
		{ createFormElement(props) }
	</div>
))`
	display: flex;
	flex-wrap: wrap;
	padding: 4px 0;
	font-size: 0.875rem;
	min-width: 400px;
	max-width: 600px;

	& > label:first-child,
	& > legend:first-child {
		color: #707070;
		width: 145px;
		flex-shrink: 0;
		margin: 6px 16px 0 0;
		font-size: 0.875rem;
		text-align: right;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
	
	input:not([type="radio"]):not([type="checkbox"]):not([type="file"]),
	& > textarea,
	& > fieldset {
		flex: auto;
		font-family: inherit;
	}

	input:not([type="radio"]):not([type="checkbox"]):not([type="file"]),
	& > textarea {
		background-color: #FAFBFC;
		border: 1px solid #ccc;
		border-radius: 3px;
		padding: 4px 5px;

		:active,
		:focus {
			box-shadow: 0 0 0 2px ${({ theme }) => lighten(0.17, theme.primary)} inset;
		}
	}

	input:not([type="radio"]):not([type="checkbox"]):not([type="file"]) {
		height: 32px;
		margin: 0;
	}

	& > textarea {
		min-height: 85px;
		overflow-x: hidden;
	}

	& > fieldset {
		border: none;
		margin: 0;
		padding: 4px 5px;
		
		label {
			display: flex;
			align-items: center;

			input {
				margin: 0 8px 0 0;
			}
		}
	}

	& > p {
		margin: 5px 0 5px 161px;
		padding: 6px 0;
		font-size: 0.75rem;
		color: #707070;
	}

	& > label:nth-child(2) {
		width: 96px;
		height: 96px;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;

		div {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			padding: 5px;
			background-color: rgba(0, 0, 0, 0.4);
			border-radius: 3px;
			opacity: 0;
			display: flex;
			align-items: center;
			text-align: center;
			color: #fff;
		}

		img {
			border-radius: 50%;
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		input[type="file"] {
			display: none;
		}

		:hover {
			cursor: pointer;

			div {
				opacity: 1;
			}
		}
	}
`;

export default Input;