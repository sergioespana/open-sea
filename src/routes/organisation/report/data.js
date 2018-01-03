import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { app } from 'mobx-app';
import Button from 'components/Button';
import Container from 'components/Container';
import get from 'lodash/get';
import Input from 'components/Input';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';

@inject(app('ReportsStore'))
@observer
class Data extends Component {
	render() {
		const { ReportsStore, match: { params: { id, rep } } } = this.props;
		const report = ReportsStore.findById(id, rep);
		const model = get(report, 'model') || {};
		const data = get(report, 'data') || {};

		return (
			<Container>
				{ map(model.metrics, (metric, key) => (
					<Input
						key={key}
						label={metric.name}
						help={metric.help}
						type={metric.type}
						value={get(data, key)}
						onChange={console.log}
					/>
				)) }
				<Button
					disabled={isEmpty(data)}
					onClick={console.log}
					style={{ marginTop: 20 }}
				>Save report data</Button>
			</Container>
		);
	}
}

export default Data;