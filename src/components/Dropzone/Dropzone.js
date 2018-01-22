import { inject, observer } from 'mobx-react';
import { matchPath, withRouter } from 'react-router-dom';
import React, { Component } from 'react';
import { app } from 'mobx-app';
import get from 'lodash/get';
import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';
import styled from 'styled-components';
import Zone from 'react-dropzone';

const Overlay = styled(({ hidden, ...props }) => !hidden && <div {...props} />)`
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 999;
`;

@inject(app('ReportsStore', 'VisualStore'))
@observer
class Dropzone extends Component {
	state = {
		dragging: false
	}

	onDragEnter = () => this.isEnabled() && this.setState({ dragging: true });

	onDragLeave = () => this.state.dragging && this.setState({ dragging: false });

	onDrop = (accepted, rejected) => {
		this.onDragLeave();
		if (accepted.length === 0 && rejected.length > 0) return alert('file rejected'); // FIXME: Alerts are bad.

		const file = accepted[0];
		const fr = new FileReader();
		fr.onload = this.onFileRead;
		fr.readAsText(file);
	}

	onFileRead = async ({ target: { result } }) => {
		if (!result) return alert('could not read file'); // FIXME: Alerts are ugly.

		const { history, ReportsStore, VisualStore } = this.props;
		const model = ReportsStore.parseTextToModel(result);
		const validationErrors = ReportsStore.validateModel(model);
		
		if (validationErrors.length > 0) {
			// FIXME: Properly handle errors.
			console.log(validationErrors);
			return alert('error in model');
		}
		
		const { params: { orgId, repId } } = matchPath(location.pathname, { path: '/:orgId/:repId' });

		VisualStore.setBusy(true);
		const { code } = ReportsStore.addModel(orgId, repId, model);
		VisualStore.setBusy(false);
		if (code) this.handleError(code);
		else history.replace(`/${orgId}/${repId}/data`);
	}

	isEnabled = () => {
		const { location, ReportsStore } = this.props;
		const match = matchPath(location.pathname, { path: '/:orgId/:repId' });
		const orgId = get(match, 'params.orgId');
		const repId = get(match, 'params.repId');

		if (isUndefined(orgId) || isUndefined(repId)) return false;

		return !isNull(ReportsStore.getItem(`${orgId}/${repId}`, '_id'));
	}

	render = () => {
		const { children, id } = this.props;
		const { dragging } = this.state;

		return (
			<Zone
				id={id}
				style={{}}
				disableClick
				accept=".yml"
				multiple={false}
				onDragEnter={this.onDragEnter}
				onDragLeave={this.onDragLeave}
				onDrop={this.onDrop}
			>
				{ children }
				<Overlay hidden={!dragging} />
			</Zone>
		);
	}
}

export default withRouter(Dropzone);