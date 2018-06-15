import Fuse from 'fuse.js';
import linkState from 'linkstate';
import { map, sortBy } from 'lodash';
import { app } from 'mobx-app';
import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import MdClose from 'react-icons/lib/md/close';
import MdFileUpload from 'react-icons/lib/md/file-upload';
import Button from '../../../components/Button';
import Container from '../../../components/Container';
import EmptyState from '../../../components/EmptyState';
import Header from '../../../components/Header';
import Modal, { ModalFooter, ModalHeader, ModalSection } from '../../../components/Modal';
import { Input, LinkInput } from '../../../components/NewInput';
import { Section } from '../../../components/Section';
import { UserGrid, UserGridItem } from '../../../components/UserGrid';
import { Model } from '../../../domain/Organisation';

interface State {
	addModalOpen: boolean;
	model: Model;
	searchable: Fuse;
	query: string;
}

@inject(app('state'))
@observer
export default class DashboardModelsOverview extends Component<any, State> {
	state: State = {
		addModalOpen: false,
		model: null,
		searchable: new Fuse([], { keys: ['name', 'email'] }),
		query: ''
	};

	searchable = null;

	componentDidMount () {
		return this.componentWillReceiveProps(this.props);
	}

	componentWillReceiveProps (nextProps) {
		const { state } = nextProps;
		return this.setState({ searchable: new Fuse(state.models, { keys: ['name'] }) });
	}

	render () {
		const { state } = this.props;
		const { addModalOpen, model, searchable, query } = this.state;
		const models: Model[] = query === '' ? [
			...sortBy(state.models, ['name']) as Model[]
		] : searchable.search(query);

		return (
			<React.Fragment>
				<Header
					title="Models"
					headTitle="dashboard / models"
				>
					{models.length > 0 && <Button appearance="light"><MdFileUpload width={20} height={20} /></Button>}
				</Header>
				<Container style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: 1024, padding: '0 20px' }}>
					<Section>
						<Input
							appearance="default"
							disabled={models.length === 0 && query === ''}
							onChange={linkState(this, 'query')}
							placeholder="Search by model name"
							value={query}
						/>
						{models.length > 0 ? (
							<UserGrid>
								{map(models, ({ _id, name }: Model) => (
									<UserGridItem
										appearance="subtle"
										key={_id}
										to={`/dashboard/models/${_id}`}
									>
										<span>{name}</span>
									</UserGridItem>
								))}
							</UserGrid>
						) : query !== '' ? (
							<EmptyState>
								<img src="/assets/images/empty-state-taken.svg" />
								<h1>Couldn't find that model</h1>
							</EmptyState>
						) : (
							<EmptyState>
								<img src="/assets/images/empty-state-welcome.svg" />
								<h1>Welcome to openSEA model repository</h1>
								<p>
									The openSEA model repository currently contains no models. Why don't you <LinkInput accept=".yml">add the first</LinkInput>?
								</p>
							</EmptyState>
						)}
					</Section>
				</Container>
				<Modal
					isOpen={addModalOpen}
					onClose={this.toggleAddModal}
				>
					<ModalHeader>
						<h1>Add a model</h1>
						<Button appearance="subtle" onClick={this.toggleAddModal}><MdClose /></Button>
					</ModalHeader>
					<ModalSection>
						{model && <pre>{JSON.stringify(model, null, 2)}</pre>}
					</ModalSection>
					<ModalFooter>
						<Button appearance="default">Save</Button>
						<Button appearance="subtle-link" onClick={this.toggleAddModal}>Cancel</Button>
					</ModalFooter>
				</Modal>
			</React.Fragment>
		);
	}

	private toggleAddModal = () => this.setState({ addModalOpen: !this.state.addModalOpen });
	private toggleViewModal = () => this.setState({ viewModalOpen: !this.state.viewModalOpen });
}
