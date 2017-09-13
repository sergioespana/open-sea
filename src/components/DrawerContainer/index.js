import { h, Component } from 'preact';
import classnames from 'classnames/bind';
import style from './style';

let cx = classnames.bind(style);

export default class DrawerContainer extends Component {
    onClick = (event) => {
        let el = event.target;
        if (el.id === 'menutoggle' || el === this.base) return;
        return this.props.toggleDrawer();
    }

    onResize = () => {
        let { isOpen, toggleDrawer } = this.props;
        if (isOpen) toggleDrawer();
    }

    componentDidUpdate() {
        let { isOpen } = this.props;
        if (isOpen) {
            window.addEventListener('click', this.onClick);
            window.addEventListener('resize', this.onResize);
        }
        else {
            window.removeEventListener('click', this.onClick);
            window.removeEventListener('resize', this.onResize);
        }
    }

    componentWillUnmount() {
        window.removeEventListener('click', this.onClick);
        window.removeEventListener('resize', this.onResize);
    }

    render({ children, isOpen, toggleDrawer, ...rest }) {
        return (
            <aside
                class={cx({
                    drawer: true,
                    isOpen
                })}
                {...rest}
            >
                { children }
            </aside>
        );
    }
}
