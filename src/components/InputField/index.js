import { h, Component } from 'preact';

import Wrapper from './components/Wrapper';
import FloatingLabel from './components/FloatingLabel';
import Inner from './components/Inner';
import BottomLabel from './components/BottomLabel';
import Input from './components/Input';
import Adornment from './components/Adornment';

// TODO: Add internal validation, enabled by "validate" prop
// TODO: Support chips (for type="list")

class InputField extends Component {
	state = {
		focus: false,
		controlled: false
	}

	onFocus = () => {
		this.setState({ focus: true });
		if (this.props.onFocus) this.props.onFocus();
	}
	
	onBlur = () => {
		if (this.base.contains(document.activeElement)) return;
		
		this.setState({ focus: false });
		if (this.props.onBlur) this.props.onBlur();
	}
	
	onInput = (event) => {
		if (this.props.onInput) this.props.onInput(event);
		if (!this.state.controlled) this.setState({ internalValue: event.target.value });
	}

	componentWillMount() {
		let { value } = this.props;
		if (value) this.setState({ controlled: true });
	}
	
	render = ({ adornment, label, fullWidth, help, disabled, value, type, ...props }, { controlled, focus, error, internalValue }) => (
		<Wrapper fullWidth={fullWidth}>
			<FloatingLabel
				shrink={focus || adornment || value || internalValue}
				focus={focus}
				disabled={disabled}
				error={error}
			>{ label }</FloatingLabel>
			<Inner
				focus={focus}
				disabled={disabled}
				error={error}
			>
				{ adornment && <Adornment>{ adornment }</Adornment> }
				<Input
					value={value || internalValue}
					type={type}
					onFocus={this.onFocus}
					onBlur={this.onBlur}
					onInput={this.onInput}
					disabled={disabled}
				/>
			</Inner>
			{ (help || error) && <BottomLabel error={error} disabled={disabled}>{ error ? error : help }</BottomLabel> }
		</Wrapper>
	)
}

export default InputField;