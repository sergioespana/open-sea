import { h } from 'preact';
import InputField from './InputField';
// import ChipInput from './ChipInput';

const Input = (props) => props.type === 'list' ? null : (
	<InputField {...props} />
);

export default Input;