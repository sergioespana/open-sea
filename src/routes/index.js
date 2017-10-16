import { h, Component } from 'preact';
import Container from '../components/Container';
import mathjs from 'mathjs';

export default class Dashboard extends Component {
	state = {
		model: null,
		metrics: null
	}

	loadFile = (event) => {
		let file = event.target.files[0];
		if (file) {
			let fr = new FileReader();
			fr.onload = this.parseFile;
			fr.readAsText(file);
			event.target.value = null;
		}
	}

	parseFile = async (event) => {
		const { MVCService } = this.context.services;
		MVCService.parseFile(event)
			.then((result) => this.setState({ model: result.model }))
			.catch((errors) => this.setState({ errors, valid: false }));
	}

	safeEval = (value, metrics) => {
		try {
			return mathjs.eval(value, metrics);
		}
		catch (e){
			return false;
		}
	}

	render(props, { model, metrics }) {
		return (
			<div id="main">
				{ model === null ? (
					<section>
						<Container>
							<h1>Input model</h1>
							<input type="file" accept=".yml" onChange={this.loadFile} />
						</Container>
					</section>
				) : (
					<section>
						<Container>
							<h1>Input data</h1>
							<div>
								{ Object.keys(model.metrics).map((id) => {
									let metric = model.metrics[id];
									return (
										<div>
											<input
												type={metric.type}
												placeholder={metric.name}
												onInput={this.linkState(`metrics.${id}`, 'target.value')}
											/>
										</div>
									);
								}) }
							</div>
						</Container>
					</section>
				)}
				{ model !== null && (
					<section>
						<Container>
							<h1>Output</h1>
							<div>
								{ Object.keys(model.indicators).map((id) => {
									let indicator = model.indicators[id],
										value = this.safeEval(indicator.value, metrics);

									return value !== false ? (
										<div>
											<h3>{ indicator.name }: { value }</h3>
											<p>{ indicator.help }</p>
										</div>
									) : null;
								}) }
							</div>
						</Container>
					</section>
				) }
			</div>
		);
	}
}
