import { h } from 'preact';
import styled from 'styled-components';

const Switch = ({ offLabel, onLabel, checked, ...props }) => (
	<div {...props}>
		<label>
			{offLabel}
			<input type="checkbox" checked={checked} />
			<span />
			{onLabel}
		</label>
	</div>
);

export default styled(Switch)`
	user-select: none;

	label {
		cursor: pointer;

		input {
			opacity: 0;
			width: 0;
			height: 0;
			margin: 0;
		}

		span {
			content: "";
			display: inline-block;
			position: relative;
			width: 36px;
			height: 14px;
			background-color: rgba(0, 0, 0, 0.38);
			border-radius: 15px;
			transition: background 200ms cubic-bezier(0.4, 0.0, 0.2, 1);
			vertical-align: middle;

			:before,
			:after {
				content: "";
				position: absolute;
				display: inline-block;
				width: 20px;
				height: 20px;
				border-radius: 50%;
				left: 0;
				top: -3px;
				transition: all 200ms cubic-bezier(0.4, 0.0, 0.2, 1);
			}

			:after {
				background-color: #fafafa;
				box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12);
			}

			:active {
				:before {
					transform: scale(2.4);
					background-color: rgba(33, 150, 243, 0.15);
				}
			}
		}

		input:checked + span {
			background-color: rgba(33, 150, 243, 0.5);

			:before,
			:after {
				left: 18px;
			}

			:before {
				background-color: rgba(38,166,154,0.15);
			}

			:after {
				background-color: #2196f3;
			}
		}
	}
`;