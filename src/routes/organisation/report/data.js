import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import Button from 'material-styled-components/Button';
import Container from 'components/Container';
import Input from 'components/Input';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import slug from 'slug';

@inject('ReportsStore', 'SnackbarStore') @observer class Data extends Component {
	render() {
		const { ReportsStore, match: { params: { id, rep } } } = this.props,
			report = ReportsStore.findById(id, rep, true);

		return (
			<Container slim>
				{ map(report.model ? report.model.metrics : {}, (metric, key) => (
					<div
						key={key}
						id={slug(metric.name).toLowerCase()}
					>
						<h4 style={{ margin: 0 }}>{ metric.name }</h4>
						<p style={{ margin: 0 }}>{ metric.help }</p>
						<Input
							type={metric.type}
							placeholder={metric.name}
							value={ReportsStore.getData(id, rep, key)}
							onChange={ReportsStore.linkMetric(id, rep, key)}
							style={{ marginBottom: 24 }}
						/>
					</div>
				)) }
				<Button
					primary
					raised
					disabled={isEmpty(ReportsStore.getData(id, rep))}
					onClick={ReportsStore.saveData(id, rep)}
				>Save</Button>
			</Container>
		);
	}
}

export default Data;