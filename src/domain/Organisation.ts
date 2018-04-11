export interface Indicator {
	value: string;
}

export interface Metric {}

export interface Model {}

export interface Report {
	_id: string;
	_orgId: string;
	_repId: string;
	created: Date;
	data: object;
	model: Model;
	name: string;
}

export interface Organisation {
	_id: string;
	_reports: Report[];
	avatar: string;
	created: Date;
	description: string;
	isPublic?: boolean;
	isNetwork?: boolean;
	name: string;
}