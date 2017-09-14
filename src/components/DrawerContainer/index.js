import { h, Component } from 'preact';
import Swipeable from 'react-swipeable';
import classnames from 'classnames/bind';
import style from './style';

let cx = classnames.bind(style);

export default class DrawerContainer extends Component {
	state = {
		isSwiping: false,
		absX: 0
	}

	onSwipeLeft = (e, absX) => {
		this.setState({ isSwiping: 'left', absX });
	}

	onSwipeLeftEnd = (e, deltaX, isFlick, velocity) => {
		let { isOpen, toggleDrawer } = this.props;
		if ((isFlick && isOpen) || deltaX > 140) {
			toggleDrawer();
			return this.setState({ isSwiping: false });
		}
		return this.reset();
	}

	onSwipeRight = (e, absX) => {
		this.setState({ isSwiping: 'right', absX });
	}

	onSwipeRightEnd = (e, deltaX, isFlick, velocity) => {
		let { isOpen, toggleDrawer } = this.props;
		if ((isFlick && !isOpen) || deltaX < -140) {
			toggleDrawer();
			return this.setState({ isSwiping: false });
		}
		return this.reset();
	}

	reset = () => this.setState({ isSwiping: false, absX: 0 });

	onClick = (event) => {
		let el = event.target;
		if (el.id === 'menutoggle' || el === this.base) return;
		return this.props.toggleDrawer();
	}

	onResize = () => {
		let { isOpen, toggleDrawer } = this.props;
		if (isOpen) toggleDrawer();
	}

	componentDidUpdate() {
		let { isOpen } = this.props;
		if (isOpen) {
			window.addEventListener('click', this.onClick);
			window.addEventListener('resize', this.onResize);
		}
		else {
			window.removeEventListener('click', this.onClick);
			window.removeEventListener('resize', this.onResize);
		}
	}

	componentWillUnmount() {
		window.removeEventListener('click', this.onClick);
		window.removeEventListener('resize', this.onResize);
	}

	render({ children, isOpen, toggleDrawer, ...rest }, { isSwiping, absX }) {
		let classes = cx({ drawer: true, isSwiping, hasShadow: isOpen || isSwiping !== false }),
			translateX, inlineStyle;

		if (isOpen && !isSwiping) translateX = 0;
		else if (isOpen && isSwiping) translateX = -absX;
		else if (!isOpen && isSwiping) translateX = Math.max(-280, Math.min(-280 + absX, 0));
		else if (!isOpen && !isSwiping) translateX = -280;

		inlineStyle = { transform: `translate3d(${translateX}px, 0, 0)` };

		return (
			<Swipeable
				nodeName="aside"
				delta={0}
				onSwipingRight={this.onSwipeRight}
				onSwipedRight={this.onSwipeRightEnd}
				onSwipingLeft={this.onSwipeLeft}
				onSwipedLeft={this.onSwipeLeftEnd}
				class={classes}
				style={inlineStyle}
				{...rest}
			>
				<div class={style.container}>{ children }</div>
			</Swipeable>
		);
	}
}
