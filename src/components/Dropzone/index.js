import { h, Component } from 'preact';
import styled from 'styled-components';
import Dropzone from 'react-dropzone';
import Overlay from './components/Overlay';

class CustomDropzone extends Component {
	state = {
		dragging: false
	}

	handleDragEnter = () => this.setState({ dragging: true });

	handleDragLeave = () => this.setState({ dragging: false });

	handleDrop = (accepted, rejected) => {
		this.handleDragLeave();

		let {
			mobxStores: { YAMLStore },
			router: { route: { match: { params: { org } } } }
		} = this.context;

		if (rejected.length > 0) return store.showSnackbar('Incorrect file type.', 4000);
		if (accepted.length <= 0) return store.showSnackbar('An unexpected error occurred.', 4000);

		YAMLStore.storeModel(org, accepted[0]);
	};

	render = ({ children, ...props }, { dragging }) => (
		<Dropzone
			accept=".yml"
			disableClick
			multiple={false}
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

export default styled(CustomDropzone)`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	min-height: inherit;
	padding: inherit;
`;