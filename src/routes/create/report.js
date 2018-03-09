import Form, { Alert } from 'components/Form';
import { inject, observer } from 'mobx-react';
import React, { Component, Fragment } from 'react';
import { Select, TextField } from 'components/Input';
import { app } from 'mobx-app';
import Button from 'components/Button';
import Helmet from 'react-helmet';
import linkState from 'linkstate';
import map from 'lodash/map';
import omit from 'lodash/omit';
import { parse } from 'query-string';
import reject from 'lodash/reject';
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

	slugify = (str) => slug(str, { lower: true, remove: /[=`#%^$*_+~.()'"!\\:@]/g });

	onChangeName = ({ target: { value } }) => {
		const { name, id } = this.state;
		return id === this.slugify(name) ? this.setState({ name: value, id: this.slugify(value) }) : this.setState({ name: value });
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

	componentWillUnmount = () => this.props.VisualStore.setBusy(false);

	render = () => {
		const { error, id, name, organisation } = this.state;
		const { state } = this.props;
		const { busy } = state;
		const organisations = reject(state.organisations, ['isNetwork', true]);
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
						<Select
							type="select"
							label="Organisation"
							required
							value={organisation}
							onChange={linkState(this, 'organisation', 'target.value')}
							disabled={busy}
							compact
						>{ map(organisations, ({ _id, name }) => <option key={_id} value={_id}>{ name }</option>) }</Select>
						<TextField
							label="Name"
							required
							value={name}
							onChange={this.onChangeName}
							onBlur={this.onBlurName}
							disabled={busy}
							compact
						/>
						<TextField
							label="URL"
							help="This will be the URL for your report. You will not be able to change it later, so choose carefully."
							prefix={`${organisation.length > 10 ? '...' : window.location.hostname}/${organisation ? `${organisation}/` : ''}`}
							required
							value={id}
							onChange={linkState(this, 'id')}
							onBlur={this.onBlurId}
							disabled={busy}
							compact
						/>
					</section>
					<footer>
						<Button
							appearance="primary"
							type="submit"
							disabled={shouldPreventSubmit}
						>Create report</Button>
						<Button
							appearance="link"
							to="/"
						>Cancel</Button>
					</footer>
				</Form>
			</Fragment>
		);
	}
}

export default withRouter(CreateReport);