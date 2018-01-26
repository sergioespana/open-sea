import Form, { Alert, Input } from 'components/Form';
import { inject, observer } from 'mobx-react';
import React, { Component, Fragment } from 'react';
import { app } from 'mobx-app';
import Button from 'components/Button';
import Helmet from 'react-helmet';
import { Link } from 'components/Link';
import linkState from 'linkstate';
import map from 'lodash/map';
import omit from 'lodash/omit';
import { parse } from 'query-string';
import slug from 'slugify';
import trim from 'lodash/trim';
import { withRouter } from 'react-router-dom';

const isBlank = (str) => !trim(str);

@inject(app('ReportsStore', 'VisualStore'))
@observer
class CreateReport extends Component {
	state = {
		error: '',
		id: '',
		name: '',
		organisation: ''
	}

	slugify = (str) => slug(str, { remove: /[=`#%^$*_+~.()'"!\-:@]/g });

	sanitize = (str) => str.replace(/[^a-z0-9áéíóúñü .,_-]/gim, '').trim();

	onChangeName = ({ target: { value } }) => {
		const { name, id } = this.state;
		return id === this.slugify(name) ? this.setState({ name: value, id: this.slugify(value) }) : this.setState({ name: value });
	}

	onBlurName = () => {
		const { name } = this.state;
		return this.setState({ name: this.sanitize(name) });
	}

	onBlurId = () => {
		const { name, id } = this.state;
		return id === '' ? this.setState({ id: this.slugify(name) }) : this.setState({ id: this.slugify(id) });
	}

	onSubmit = async (event) => {
		const { organisation: orgId, id } = this.state;
		const report = { ...omit(this.state, 'error', 'id', 'organisation'), _id: id };
		const { history, ReportsStore, VisualStore } = this.props;

		event.preventDefault();
		this.setState({ error: null });
		VisualStore.setBusy(true);

		const { code } = await ReportsStore.create(orgId, report);
		VisualStore.setBusy(false);
		if (code) this.handleError(code);
		else history.push(`/${orgId}/${id}`);
	}

	handleError = (code) => {
		switch (code) {
			case 'already-exists': return this.setState({ error: `A report with ID "${this.state.id}" already exists.` });
			default: return this.setState({ error: 'An unknown error has occurred' });
		}
	}

	componentWillMount = () => {
		const organisation = (parse(location.search) || {}).organisation || '';
		this.setState({ organisation });
	}

	render = () => {
		const { error, id, name, organisation } = this.state;
		const { state } = this.props;
		const { busy, organisations } = state;
		const shouldPreventSubmit = isBlank(name) || isBlank(id) || isBlank(organisation) || busy;

		return (
			<Fragment>
				<Helmet title="Create a report" />
				<Form standalone onSubmit={this.onSubmit}>
					<header>
						<h1>Create a report</h1>
					</header>
					<section>
						<Alert message={error} type="error" />
						<Input
							type="select"
							label="Organisation"
							required
							value={organisation}
							onChange={linkState(this, 'organisation', 'target.value')}
							options={map(organisations, (organisation) => ({ value: organisation._id, text: organisation.name }))}
							disabled={busy}
						/>
						<Input
							label="Name"
							required
							value={name}
							onChange={this.onChangeName}
							onBlur={this.onBlurName}
							disabled={busy}
						/>
						<Input
							label="URL"
							help="This will be the URL for your report. You will not be able to change it later, so choose carefully."
							prefix={`${organisation.length > 10 ? '...' : window.location.hostname}/${organisation ? `${organisation}/` : ''}`}
							required
							value={id}
							onChange={linkState(this, 'id')}
							onBlur={this.onBlurId}
							long={organisation.length > 10}
							disabled={busy}
						/>
					</section>
					<footer>
						<Button type="submit" disabled={shouldPreventSubmit}>Create report</Button>
						<Link to="/">Cancel</Link>
					</footer>
				</Form>
			</Fragment>
		);
	}
}

export default withRouter(CreateReport);