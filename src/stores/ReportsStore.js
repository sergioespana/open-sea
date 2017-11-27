import { toJS, observable } from 'mobx';
import FirebaseStore from './FirebaseStore';
import get from 'lodash/get';
import math from 'mathjs';
import set from 'lodash/set';
import slug from 'slug';
import SnackbarStore from './SnackbarStore';
import unset from 'lodash/unset';

class ReportsStore {

	@observable loading = true;
	@observable busy = false;
	reports = observable.map({});

	init = (org) => {
		if (!org) return this.loading = false;
		if (!this.loading) this.loading = true;

		FirebaseStore.addListener(`organisations/${org}/reports`, this._onRepScopeChanged);
		this.reports.set(org, observable.map({}));
	}

	findById = (org, id, toObj = false) => {
		let col = id ? this.reports.get(org).get(id) : this.reports.get(org);
		if (toObj) return toJS(col);
		return col;
	}

	create = async (org, name) => {
		this.busy = true;

		const id = slug(name).toLowerCase(),
			exists = await FirebaseStore.docExists(`organisations/${org}/reports/${id}`);

		if (exists) {
			SnackbarStore.show(`Report called ${name} already exists`);
			return;
		}

		const created = new Date();

		SnackbarStore.show(`Creating ${name}...`, 0);
		await FirebaseStore.setDoc(`organisations/${org}/reports/${id}`, { name, created });
		SnackbarStore.show(`Saved ${name}`, 4000, 'VIEW', () => console.log('TODO: Go to new report'));
		this.busy = false;
	}

	addModelToReport = async (org, id, model, overwrite = false) => {
		// TODO: Check for existing model and ask to overwrite through a dialog
		this.busy = true;
		SnackbarStore.show(`Saving model...`, 0);
		await FirebaseStore.setDoc(`organisations/${org}/reports/${id}`, { model });
		SnackbarStore.show(`Saved model`);
		this.busy = false;
	}

	getData = (org, rep, path) => {
		if (!this.reports.has(org)) return '';
		
		const organisation = this.reports.get(org);
		if (!organisation.has(rep)) return '';

		const report = organisation.get(rep);
		if (!report.has('data')) return '';

		const data = report.get('data');
		if (path) return toJS(get(data, path)) || '';
		return toJS(data);
	}

	linkMetric = (org, rep, path) => (event) => {
		const { target: { value } } = event,
			report = this.reports.get(org).get(rep);

		if (!report.has('data')) report.set('data', {});

		let data = this.getData(org, rep);
		if (value === '' || value === null) unset(data, path);
		else set(data, path, value);
		
		return report.set('data', data);
	}

	saveData = (org, rep) => async (event) => {
		const data = this.getData(org, rep);
		
		if (!data) return;

		this.busy = true;
		SnackbarStore.show('Saving data...', 0);
		await FirebaseStore.setDoc(`organisations/${org}/reports/${rep}`, { data });
		SnackbarStore.show('Saved data');
	}
	
	computeIndicator = (org, rep, { type, value }) => {
		const data = toJS(this.getData(org, rep));
		try {
			if (type === 'number') return math.eval(value, data);
			if (type === 'percentage') return math.round(math.eval(value, data), 2);
			return `Can't output type "${type}" yet`;
		}
		catch (error) {
			return null;
		}
	}

	reset = () => {
		this.limit = 0;
		this.count = 0;
		this.reports.clear();
	}

	limit = 0;
	count = 0;

	_onRepScopeChanged = (snapshot) => {
		if (snapshot.empty) {
			this.count++;
			if (this.count === this.limit) this.loading = false;
			return;
		}

		this.limit = snapshot.size;
		snapshot.docChanges.forEach(this._handleRepScopeChanged);
	}

	_handleRepScopeChanged = (change) => {
		if (change.type === 'added') return this._addReportListener(change.doc);
		if (change.type === 'removed') return this._removeReportListener(change.doc);
	}

	_addReportListener = (doc) => {
		const id = doc.id,
			org = doc._key.path.segments.slice(doc._key.path.offset)[1],
			path = `organisations/${org}/reports/${id}`;
		
		FirebaseStore.addListener(path, this._onReportData);
		this.reports.get(org).set(id, observable.map({}));
	}

	_removeReportListener = (doc) => {
		const id = doc.id,
			org = doc._key.path.segments.slice(doc._key.path.offset)[1],
			path = `organisations/${org}/reports/${id}`;
		
		FirebaseStore.removeListener(path);
		this.reports.get(org).delete(id);
	}

	_onReportData = (doc) => {
		if (!doc.exists) return this._removeReportListener(doc);

		const id = doc.id,
			org = doc._key.path.segments[1];
		
		this.reports.get(org).get(id).merge(doc.data());

		this.count++;
		if (this.count === this.limit) this.loading = false;
	}
}

export default new ReportsStore();