import { h } from 'preact';
import styled from 'styled-components';

const Wrapper = styled.div`
	position: fixed;
	bottom: 0;
	left: 50%;
	transform: ${props => props.doClose ? 'translate3d(-50%, 100%, 0)' : 'translate3d(-50%, 0, 0)' };
	height: 48px;
	min-width: 288px;
	max-width: 568px;
	padding: 0 24px;
	background-color: #323232;
	border-radius: 2px;
	color: #fff;
	display: flex;
	flex-direction: row;
	align-items: center;
	font-size: 14px;
	animation-name: ${props => props.doClose ? 'snackbarDisappear' : 'snackbarAppear' };
	animation-duration: ${props => props.doClose ? '195ms' : '225ms' };
	animation-timing-function: ${props => props.doClose ? 'cubic-bezier(0.0, 0.0, 0.2, 1)' : 'cubic-bezier(0.4, 0.0, 0.2, 1)' };

	@keyframes snackbarAppear {
		from { transform: translate3d(-50%, 100%, 0); }
		to { transform: translate3d(-50%, 0, 0); }
	}

	@keyframes snackbarDisappear {
		from { transform: translate3d(-50%, 0, 0); }
		to { transform: translate3d(-50%, 100%, 0); }
	}
`;

export default Wrapper;