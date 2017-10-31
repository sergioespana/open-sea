import { h } from 'preact';
import styled from 'styled-components';

const Wrapper = styled.div`
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	min-height: 48px;
	max-height: 112px;
	padding: 0 24px;
	background-color: #323232;
	color: #fff;
	display: flex;
	flex-direction: row;
	align-items: center;
	font-size: 14px;
	box-shadow: 0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12), 0 3px 5px -1px rgba(0,0,0,0.2);
	animation-name: ${props => props.doClose ? 'snackbarDisappearMobile' : 'snackbarAppearMobile' };
	animation-duration: ${props => props.doClose ? '195ms' : '225ms' };
	animation-timing-function: ${props => props.doClose ? 'cubic-bezier(0.0, 0.0, 0.2, 1)' : 'cubic-bezier(0.4, 0.0, 0.2, 1)' };
	
	@media (min-width: 601px) {
		min-width: 288px;
		max-width: 568px;
		height: 48px;
		left: 50%;
		border-radius: 2px;
		transform: ${props => props.doClose ? 'translate3d(-50%, 100%, 0)' : 'translate3d(-50%, 0, 0)' };
		animation-name: ${props => props.doClose ? 'snackbarDisappearDesktop' : 'snackbarAppearDesktop' };
	}


	@keyframes snackbarAppearDesktop {
		from { transform: translate3d(-50%, 100%, 0); }
		to { transform: translate3d(-50%, 0, 0); }
	}

	@keyframes snackbarDisappearDesktop {
		from { transform: translate3d(-50%, 0, 0); }
		to { transform: translate3d(-50%, 100%, 0); }
	}

	@keyframes snackbarAppearMobile {
		from { transform: translate3d(0, 100%, 0); }
		to { transform: translate3d(0, 0, 0); }
	}

	@keyframes snackbarDisappearMobile {
		from { transform: translate3d(0, 0, 0); }
		to { transform: translate3d(0, 100%, 0); }
	}
`;

export default Wrapper;