import { inject, observer } from 'mobx-react';
import { matchPath, withRouter } from 'react-router-dom';
import React, { Component } from 'react';
import { app } from 'mobx-app';
import attempt from 'lodash/attempt';
import DropZone from 'react-dropzone';
import get from 'lodash/get';
import isError from 'lodash/isError';
import isUndefined from 'lodash/isUndefined';
import styled from 'styled-components';

const Overlay = styled.div`
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 24;
`;

@inject(app('MVCStore', 'ReportsStore'))
@observer
class Dropzone extends Component {
	state = {
		dragging: false
	}

	onDragEnter = () => this.isValidReportRoute() && this.setState({ dragging: true });

	onDragLeave = () => this.state.dragging && this.setState({ dragging: false });

	onDrop = (accepted, rejected) => {
		this.onDragLeave();
		// TODO: Display error to user that file was rejected.
		if (accepted.length === 0 && rejected.length > 0) return console.log('file rejected');
		
		const file = accepted[0];
		const fr = new FileReader();
		fr.onload = this.onFileRead;
		fr.readAsText(file);
	}
	
	onFileRead = async ({ target: { result } }) => {
		// TODO: Display error to user that file couldn't be read.
		if (!result) return console.log('could not read file');

		const { MVCStore, ReportsStore } = this.props;
		const model = ReportsStore.parseTextToModel(result);
		const res = ReportsStore.validateModel(model);

		if (res.length > 0) {
			// Model contained errors, show.
			return console.log(res);
		}

		MVCStore.setBusy(true);
		const { params: { rep, org } } = this.getRouteMatch();
		const add = await attempt(() => ReportsStore.addModel(org, rep, model));
		MVCStore.setBusy(false);
		if (isError(add)) return this.handleError(org);
	}

	handleError = (error) => {
		// TODO: Handle error.
		console.log(error);
	}

	getRouteMatch = () => matchPath(this.props.location.pathname, { path: '/:org/:rep' });

	isValidReportRoute = () => {
		const { state } = this.props;
		const match = this.getRouteMatch();
		const org = get(match, 'params.org');
		const rep = get(match, 'params.rep');
		return !isUndefined(get(state.reports, `${org}.${rep}`));
	}

	render() {
		let { children, id } = this.props,
			{ dragging } = this.state;
		
		return (
			<DropZone
				onDragEnter={this.onDragEnter}
				onDragLeave={this.onDragLeave}
				onDrop={this.onDrop}
				accept=".yml"
				disableClick
				multiple={false}
				style={{}}
				id={id}
			>
				{ children }
				{ dragging && <Overlay /> }
			</DropZone>
		);
	}
}

export default withRouter(Dropzone);