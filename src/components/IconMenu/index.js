import { h, Component } from 'preact';
import IconButton from '../IconButton';
import Menu from 'material-ui/Menu';

export default class IconMenu extends Component {
	state = {
		anchorEl: null,
		open: false
	}

	handleClickOpen = (e) => this.setState({ anchorEl: e.currentTarget, open: true });

	handleRequestClose = () => this.setState({ open: false });

	render = ({ icon, children }, { anchorEl, open }) => (
		<div>
			<IconButton
				icon={icon}
				onClick={this.handleClickOpen}
			/>
			<Menu
				anchorEl={anchorEl}
				open={open}
				onRequestClose={this.handleRequestClose}
			>
				{ children }
			</Menu>
		</div>
	);
}