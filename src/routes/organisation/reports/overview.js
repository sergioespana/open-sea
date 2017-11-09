import { h } from 'preact';
import Main from '../../../components/Main';
import Container from '../../../components/Container';
import Grid from '../../../components/Grid';
import ImageCard from  '../../../components/ImageCard';
import PlusIcon from 'react-material-icon-svg/dist/PlusIcon';

const Overview = () => (
	<Main>
		<Container>
			<Grid gutter={24} childMinWidth={200}>
				<ImageCard
					primary="New report"
					icon={<PlusIcon />}
				/>
			</Grid>
		</Container>
	</Main>
);

export default Overview;