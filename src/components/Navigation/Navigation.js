import React, { Component } from 'react';
import styled from 'styled-components';

class Navigation extends Component {
	state = {
		width: 64
	}

	getWidth = () => this.wrapper ? this.wrapper.clientWidth : 64;

	setWidth = (width) => this.state.width !== width && this.setState({ width });

	componentDidMount = () => this.setWidth(this.getWidth());
	
	componentDidUpdate = () => this.setWidth(this.getWidth());

	render = () => {
		const { children, expanded, ...props } = this.props;
		const { width } = this.state;
		return (
			<aside {...props} style={{ width }}>
				<div ref={(elem) => this.wrapper = elem}>{ children }</div>
			</aside>
		);
	}
}

export default styled(Navigation)`
	display: flex;
	position: relative;
	flex-shrink: 0;

	& > div {
		position: fixed;
		display: flex;
		height: 100%;
		z-index: 300;
	}
`;