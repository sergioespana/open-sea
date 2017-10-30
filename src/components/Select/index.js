import { h, Component } from 'preact';
import Portal from 'preact-portal';
import { map, findIndex } from 'lodash';

import Wrapper from './components/Wrapper';
import Menu, { MenuItem } from '../Menu';
import Icon from './components/Icon';
// import Option from './components/Option';

const Option = (props) => <div role="option" {...props} />; 

class Select extends Component {
	state = {
		open: false,
		options: []
	}

	componentWillMount() {
		this.componentWillReceiveProps(this.props);
	}
	
	componentWillReceiveProps(props) {
		let { children, value } = props,
			options = children.map((child) => child.attributes);

		this.setState({ options });
	}

	handleClickOpen = (event) => {
		if (this.state.open === false) {
			let rect = event.target.getBoundingClientRect();
			this.setState({ open: {
				x: rect.x,
				y: rect.y - 6
			} });
			window.addEventListener('click', this.handleRequestClose);
		}
	}

	handleSelect = (event) => {
		this.setState({ open: false });

		let newValue = event.target.__preactattr_.value,
			{ value } = this.state,
			{ onChange } = this.props;
		
		if (onChange && newValue !== value) onChange(newValue);
	}

	handleRequestClose = (event) => {
		let base = this.base,
			target = event.target;
		
		if (target !== base) {
			window.removeEventListener('click', this.handleRequestClose);
			this.setState({ open: false });
		}
	}

	findValueIndex = (value) => findIndex(this.state.options, ['value', value]) || 0;

	render = ({ value, ...props }, { open, options }) => (
		<Wrapper {...props} onClick={this.handleClickOpen}>
			{ options[this.findValueIndex(value)].text }
			<Icon />
			{ open && ( 
				<Portal into="body">
					<Menu pos={open}>
						{ map(options, (option, index) => (
							<MenuItem
								onClick={this.handleSelect}
								value={option.value}
								active={option.value === value}
							>{ option.text }</MenuItem>
						)) }
					</Menu>
				</Portal>
			) }
		</Wrapper>
	);
}

export {
	Option
};
export default Select;