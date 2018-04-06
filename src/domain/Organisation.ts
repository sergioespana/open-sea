export interface Report {
	_id: string;
	_orgId: string;
	_repId: string;
	created: Date;
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

export type OrganisationCollection = Organisation[];
