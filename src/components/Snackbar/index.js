import { h, Component } from 'preact';

export default class SnackBar extends Component {
	
	componentDidMount() {
		const { services: { SnackService } } = this.context;
		return SnackService.show(this.props.message, this.props);
	}
	
	componentWillUnmount() {
		const { services: { SnackService } } = this.context;
		return SnackService.hide();
	}

	render = () => null;
}