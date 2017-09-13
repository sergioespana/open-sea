import { h, Component } from 'preact';
import style from './style';

export default class Observer extends Component {
    componentWillMount() {
        this.observer = new IntersectionObserver(this.props.cb);
    }

    componentDidMount() {
        this.observer.observe(this.base);
    }

    componentWillUnmount() {
        this.observer.unobserve(this.base);
        this.observer.disconnect();
    }

    render({ children, cb, ...rest }) {
		return <div { ...rest } class={style.observer}>{ children }</div>
	}
}

// TODO: Check for proptypes
