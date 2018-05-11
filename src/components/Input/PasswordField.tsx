import { map } from 'lodash';
import { darken } from 'polished';
import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import zxcvbn from 'zxcvbn';
import TextField from './TextField';

const MeterWrapper = styled.div`
	display: flex;
	height: 2px;
	justify-content: space-between;
	margin: 4px 0;
`;

interface MeterItemProps {
	score: number;
	threshold: number;
}

const MeterItem = styled<MeterItemProps, 'div'>('div')`
	background-color: ${({ score, theme, threshold }) => score > threshold ? getColor(score) : darken(0.05, theme.light)};
	border-radius: 10px;
	flex: 20%;
	height: 100%;

	&:not(:last-child) {
		margin-right: 5px;
	}
`;

const Label = styled.div`
	color: ${({ theme }) => theme.text.secondary};
	font-size: 0.875rem;
	height: 16px;
	margin: 0 0 12px 0;
	text-align: center;
`;

export default class PasswordField extends Component<any> {

	render () {
		const { value } = this.props;
		const score = value === '' ? -1 : zxcvbn(value).score;
		const label = getLabel(score);

		return (
			<TextField
				{...this.props}
				childrenAfterInput
			>
				<Fragment>
					<MeterWrapper>{map(Array(5), (v, i) => <MeterItem key={`item-${i}`} threshold={i - 1} score={score} />)}</MeterWrapper>
					<Label>{label}</Label>
				</Fragment>
			</TextField>
		);
	}
}

const getColor = (score) => {
	switch (score) {
	case 0: return '#BF2600';
	case 1: return '#FF5630';
	case 2: return '#FFAB00';
	case 3: return '#36B37E';
	case 4: return '#00875A';
	}
};

const getLabel = (score) => {
	switch (score) {
	case 0: return 'Weak';
	case 1: return 'Fair';
	case 2: return 'Good';
	case 3: return 'Strong';
	case 4: return 'Very strong';
	default: return '';
	}
};
