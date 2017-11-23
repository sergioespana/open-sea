import React, { Component } from 'react';
import DropZone from 'react-dropzone';
import { inject } from 'mobx-react';
import pathToRegexp from 'path-to-regexp';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

const Overlay = styled.div`
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 24;
`;

@inject('ReportsStore', 'SnackbarStore', 'YAMLStore') class Dropzone extends Component {
	state = {
		dragging: false
	}

	handleDragEnter = () => this.isValidReportRoute() && this.setState({ dragging: true });

	handleDragLeave = () => this.state.dragging && this.setState({ dragging: false });

	handleDrop = (accepted, rejected) => {
		this.handleDragLeave();
		
		const match = this.isValidReportRoute(),
			{ ReportsStore, SnackbarStore, YAMLStore } = this.props;

		if (!match) return this.handleDragLeave();
		if (rejected.length > 0) return SnackbarStore.show(`File is of an unsupported filetype (${rejected[0].type})`);

		const [org, rep] = match,
			file = accepted[0];

		const fr = new FileReader();
		fr.onload = ({ target: { result } }) => {
			if (!result) return SnackbarStore.show('Unable to read the file');
			
			const model = YAMLStore.parse(result) || {},
				valid = YAMLStore.validate(model);

			if (!valid) return SnackbarStore.show(YAMLStore.buildErrorMessage(model));

			ReportsStore.addModelToReport(org, rep, model);
		};
		fr.readAsText(file);
	}

	isValidReportRoute = () => {
		const { location, ReportsStore } = this.props,
			reports = ReportsStore.reports,
			re = pathToRegexp('/:id/:rep'),
			match = location.pathname.match(re);

		if (!match) return false;

		const [, org, rep] = match;

		if (!reports.has(org)) return false;

		if (!reports.get(org).has(rep)) return false;

		return [org, rep];
	}

	render() {
		let { children, id } = this.props,
			{ dragging } = this.state;
		return (
			<DropZone
				onDragEnter={this.handleDragEnter}
				onDragLeave={this.handleDragLeave}
				onDrop={this.handleDrop}
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