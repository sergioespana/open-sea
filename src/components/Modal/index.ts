import Loadable from 'react-loadable';
export { default as ModalFooter } from './ModalFooter';
export { default as ModalHeader } from './ModalHeader';
export { default as ModalSection } from './ModalSection';

const Modal = Loadable({
	loader: () => import('./Modal'),
	loading: () => null
});

export { Modal };
export default Modal;
