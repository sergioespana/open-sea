export interface Model {
	certifications: any;
	indicators: any;
	metrics: any;
}

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
	_organisations: Organisation[];
	_reports: Report[];
	avatar: string;
	created: Date;
	description: string;
	isPublic?: boolean;
	isNetwork?: boolean;
	model: Model;
	name: string;
}
