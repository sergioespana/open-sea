import { h } from 'preact';
import { Link } from 'react-router-dom';
import { CircularProgress } from 'material-ui/Progress';
import Container from '../components/Container';

const Dashboard = (props, { services: { AuthService, OrgService } }) => {
	return (
		<div id="main">
			<Container>
				<p>Organisations you manage:</p>
				{ OrgService.loading ? (
					<CircularProgress />
				) : (
					<ul>
						{ OrgService.collection.map((org) => (
							<li>
								<Link to={`${org.id}/overview`}>{ org.id }</Link>
							</li>
						)) }
					</ul>
				) }
			</Container>
		</div>
	);
};

export default Dashboard;