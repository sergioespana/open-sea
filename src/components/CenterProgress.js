import Circular from 'material-styled-components/Progress/Circular';

const CenterProgress = Circular.extend`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate3d(-50%, 50%, 0);
`;

export default CenterProgress;