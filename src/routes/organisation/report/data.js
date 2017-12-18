import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import Button from 'components/Button';
import Container from 'components/Container';
import Input from 'components/Input';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';

@inject('ReportsStore', 'SnackbarStore') @observer class Data extends Component {
	render() {
		const { ReportsStore, match: { params: { id, rep } } } = this.props,
			report = ReportsStore.findById(id, rep, true);

		return (
			<Container>
				{ map(report.model ? report.model.metrics : {}, (metric, key) => (
					<Input
						key={key}
						label={metric.name}
						help={metric.help}
						type={metric.type}
						value={ReportsStore.getData(id, rep, key)}
						onChange={ReportsStore.linkMetric(id, rep, key)}
					/>
				)) }
				<Button
					disabled={isEmpty(ReportsStore.getData(id, rep))}
					onClick={ReportsStore.saveData(id, rep)}
					style={{ marginTop: 20 }}
				>Save report data</Button>
			</Container>
		);
	}
}

export default Data;