import { h } from 'preact';
import Container from '../components/Container';
import YAMLParser from '../components/YAMLParser';

const Validator = () => (
	<div id="main">
		<Container>
			<YAMLParser />
		</Container>
	</div>
);

export default Validator;
