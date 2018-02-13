import React, { Component, Fragment } from 'react';
import { darken } from 'polished';
import styled from 'styled-components';
import TextField from './TextField';
import zxcvbn from 'zxcvbn';

const Input = TextField.extend`
	margin-bottom: 0 !important;
`;

const Meter = styled.div`
	display: flex;
	justify-content: space-between;
	margin-top: 4px !important;
	margin-bottom: 4px !important;
	height: 2px;
`;

const MeterItem = styled.div`
	height: 100%;
	flex: 20%;
	background-color: ${({ theme }) => darken(0.05, theme.light)};
	border-radius: 10px;

	&:not(:last-child) {
		margin-right: 5px;
	}

	${({ active, ...props }) => active && `
		background-color: ${props['data-color']};
	`}
`;

const Label = styled.div`
	text-align: center;
	color: ${({ theme }) => theme.text.secondary};
	font-size: 0.875rem;
	height: 16px;
	margin-bottom: 12px !important;
`;

class PasswordField extends Component {
	state = {
		show: false,
		score: -1
	}

	getColor = (score) => {
		switch (score) {
			case 0: return '#BF2600';
			case 1: return '#FF5630';
			case 2: return '#FFAB00';
			case 3: return '#36B37E';
			case 4: return '#00875A';
		}
	}

	getLabel = (score) => {
		switch (score) {
			case 0: return 'Weak';
			case 1: return 'Fair';
			case 2: return 'Good';
			case 3: return 'Strong';
			case 4: return 'Very strong';
			default: return '';
		}
	}

	componentWillReceiveProps = (nextProps) => {
		const { value } = nextProps;
		if (!value || value === '') return this.setState({ score: -1 });

		const { score } = zxcvbn(value);
		this.setState({ score });
	}

	render = () => {
		const { ...props } = this.props;
		const { score, show } = this.state;
		const color = this.getColor(score);

		return (
			<Fragment>
				<Input {...props} type={show ? 'text' : 'password'} />
				<Meter>
					<MeterItem active={score > -1} data-color={color} />
					<MeterItem active={score > 0} data-color={color} />
					<MeterItem active={score > 1} data-color={color} />
					<MeterItem active={score > 2} data-color={color} />
					<MeterItem active={score > 3} data-color={color} />
				</Meter>
				<Label>{ this.getLabel(score) }</Label>
			</Fragment>
		);
	}
}

export default PasswordField;