import { map } from 'lodash';
import React, { SFC } from 'react';
import { MdClose } from 'react-icons/md';
import { Link, LinkProps } from 'react-router-dom';
import styled from '../../util/styled-components';
import FlagContent from './FlagContent';
import FlagHeader from './FlagHeader';

interface IFlagAction {
	label: React.ReactNode;
	onClick?: (event: React.MouseEvent<any>) => void;
	to?: LinkProps['to'];
}

export interface IFlag {
	actions?: IFlagAction[];
	appearance: 'error' | 'info' | 'normal' | 'success' | 'warning';
	description?: React.ReactNode;
	icon?: any;
	onDismiss: (flag: IFlag) => void;
	title: string;
}

const UnstyledFlag: SFC<IFlag> = (props) => {
	const { appearance, actions, description, icon, onDismiss, title, ...rest } = props;
	const flag = { appearance, actions, description, icon, onDismiss, title };

	return (
		<div {...rest}>
			<FlagHeader>
				<div>{icon}</div>
				<span>{title}</span>
				{onDismiss && <button onClick={callOnDismiss(flag, onDismiss)}><MdClose /></button>}
			</FlagHeader>
			{(actions || description) && <FlagContent>
				<div>{description}</div>
				{actions && (
					<div>
						{map(actions, ({ label, onClick, to }) => to
							? <Link to={to} onClick={callOnDismiss(flag, onDismiss)}>{label}</Link>
							: <a onClick={dissmissThenCall(flag, onClick)}>{label}</a>
						)}
					</div>
				)}
			</FlagContent>}
		</div>
	);
};

const getBackgroundColor = ({ appearance, theme }) => {
	switch (appearance) {
	case 'error':
		return theme.red;
	case 'info':
		return theme.muted;
	case 'success':
		return theme.green;
	case 'warning':
		return '#ffc400';
	default:
		return '#ffffff';
	}
};

const getColor = ({ appearance, theme }) => {
	if (['warning', 'normal'].includes(appearance)) return theme.text.primary;
	return '#ffffff';
};

const Flag = styled(UnstyledFlag)`
	background-color: ${getBackgroundColor};
	bottom: 0;
	border-radius: 3px;
	box-shadow: rgba(9, 30, 66, 0.31) 0px 0px 1px, rgba(9, 30, 66, 0.25) 0px 20px 32px -8px;
	color: ${getColor};
	padding: 16px;
	position: absolute;
	width: 400px;
	z-index: 600;

	&:nth-child(1) {
		z-index: 5;
	}

	&:nth-child(1n + 2) {
		pointer-events: none;
		transform: translateX(0px) translateY(100%) translateY(16px);
		z-index: 4;
	}

	&:nth-child(1n + 3) {
		display: none;
	}
`;

export { Flag };
export default Flag;

const dissmissThenCall = (flag: IFlag, onClick: IFlagAction['onClick']) =>
	(event: React.MouseEvent<any>) => {
		flag.onDismiss(flag);
		onClick(event);
	};

const callOnDismiss = (flag: IFlag, onDismiss: IFlag['onDismiss']) => (event: React.MouseEvent<any>) => onDismiss(flag);
