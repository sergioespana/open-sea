import { h, Component } from 'preact';
import styled from 'styled-components';

const RippleContainer = styled.span`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	display: block;
    overflow: hidden;
    border-radius: inherit;
`;

const Ripple = styled.span`
	position: absolute;
	border-radius: 100%;
	background: currentColor;
	opacity: ${props => props.done ? 0 : props.held ? 0.4 : 0.2 };
	width: ${props => `${props.width}px` || 0};
	height: ${props => `${props.height}px` || 0};
	left: ${props => `${props.left}px` || 'auto'};
	top: ${props => `${props.top}px` || 'auto'};
	transform: ${props => props.held ? 'scale(1)' : 'scale(0)'};
	pointer-events: none;
	user-select: none;
	transition: transform 225ms ease-out, opacity 225ms ease-out;
`;

class MaterialRipple extends Component {
	state = {
		disabled: false,
		held: false,
		done: false,
		width: 0,
		height: 0,
		left: 0,
		top: 0
	}

	startRipple = (event) => {
		let holder = event.target,
			rect = holder.getBoundingClientRect(),
			x = event.offsetX,
			y;
	
		if (x !== undefined) y = event.offsetY;
		else {
			x = event.clientX - rect.left;
			y = event.clientY - rect.top;
		}

		let max;
	
		if (rect.width >= rect.height) max = rect.width * 2;
		else max = rect.height * 2;
		
		window.addEventListener('mouseup', this.onMouseUp);
		this.setState({
			held: true,
			width: max,
			height: max,
			left: x - max / 2,
			top: y - max / 2
		});
	}
	
	endRipple = () => {
		window.removeEventListener('mouseup', this.onMouseUp);
		this.setState({ done: true });
		setTimeout(() => this.setState({
			held: false,
			done: false,
			width: 0,
			height: 0,
			left: 0,
			top: 0
		}), 225);
	}
	
	onMouseDown = (event) => this.startRipple(event);
	
	onMouseUp = (event) => this.endRipple();

	componentDidMount() {
		let holder = this.base,
			holderParentPosition = window.getComputedStyle(holder.parentNode).getPropertyValue('position');

		if (holderParentPosition !== 'relative') return this.setState({ disabled: true });
		
		holder.addEventListener('mousedown', this.onMouseDown);
	}
	
	componentWillUnmount() {
		let holder = this.base;
		holder.removeEventListener('mousedown', this.onMouseDown);
	}

	render = (props, { disabled, ...state }) => !disabled && (
		<RippleContainer>
			<Ripple {...state} />
		</RippleContainer>
	);
}

export default MaterialRipple;