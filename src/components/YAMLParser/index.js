import { h, Component } from 'preact';
import style from './style';

export default class YAMLParser extends Component {
	state = {
		errors: [],
		valid: null
	}

	loadFile = (event) => {
		let file = event.target.files[0];
		if (file) {
			let fr = new FileReader();
			fr.onload = this.parseFile;
			fr.readAsText(file);
		}
	}

	parseFile = async (event) => {
		const { YAMLService } = this.context.services;
		YAMLService.parseFile(event)
			.then((result) => this.setState({ valid: true }))
			.catch((errors) => this.setState({ errors, valid: false }));
	}

	render(props, { errors, valid }) {
		return (
			<div class={style.parser}>
				<input type="file" accept=".yml" onClick={this.reset} onChange={this.loadFile} />
				{ valid !== null && <p>Uploaded model is <strong>{ valid ? 'correct!' : 'incorrect:' }</strong></p> }
				{ valid === false && (
					<ul>
						{ errors.map(({ dataPath, message }) => (
							<li>{`${dataPath} ${message}`}</li>
						)) }
					</ul>
				) }
			</div>
		);
	}
}
