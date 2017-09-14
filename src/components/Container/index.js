import { h } from 'preact';
import style from './style';

const Container = ({ children, ...props }) => <div {...props} class={style.container}>{ children }</div>;

export default Container;

// TODO: Define dynamic props (to adjust the components looks through props and having the component apply a different class to itself)
// TODO: Check for proptypes
