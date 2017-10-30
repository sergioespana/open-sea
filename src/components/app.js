import { h, Component } from 'preact';
import styled from 'styled-components';
import Dropzone from 'react-dropzone';

const Overlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.6);
	z-index: 20;
`;

class App extends Component {
	state = {
		dragging: false
	}

	handleDragEnter = () => this.setState({ dragging: true });

	handleDragLeave = () => this.setState({ dragging: false });

	handleDrop = (accepted, rejected) => {
		this.handleDragLeave();

		let { mobxStores: { store } } = this.context;

		if (rejected.length > 0) return store.showSnackbar('Incorrect file type.', 4000);
		if (accepted.length <= 0) return store.showSnackbar('An unexpected error occurred.', 4000);

		store.parseFile(accepted[0]);
	};

	render = ({ children, ...props }, { dragging }) => {
		let { router: { route: { location: { pathname } } } } = this.context,
			org = pathname.split('/')[1];
		return (
			<Dropzone
				id="app"
				accept=".yml"
				disableClick
				multiple={false}
				style={{}}
				onDragEnter={this.handleDragEnter}
				onDragLeave={this.handleDragLeave}
				onDrop={this.handleDrop}
				{...props}
			>
				{ dragging && <Overlay /> }
				{ children }
			</Dropzone>
		);
	}
}

export default styled(App)`
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	min-height: 100vh;
`;