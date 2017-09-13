import { h, Component } from 'preact';
import style from './style';

export default class Container extends Component {
	render({ children, ...props }) {
		return <div {...props} class={style.container}>{ children }</div>;
	}
}

// TODO: Define dynamic props (to adjust the components looks through props and having the component apply a different class to itself)
// TODO: Check for proptypes
