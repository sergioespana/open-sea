export interface Requirement {
	_computed?: number;
	_pass?: boolean;
	indicator: string;
	operator: '>' | '>=' | '<' | '<=' | '==';
	value: string | number;
}

export interface Certification {
	_index?: number;
	_pass?: boolean;
	colour?: string;
	description?: string;
	level?: number;
	name: string;
	requirements: Requirement[];
}

export interface Category {
	name: string;
}

export interface Indicator {

}

export interface Metric {

}

export interface Model {
	_id: string;
	categories?: Category[];
	certifications?: Certification[];
	indicators: Indicator[];
	metrics: Metric[];
	name: string;
	reportItems?: Array<any>;
}

export interface Specification {
}

export interface Report {
	_id: string;
	_orgId: string;
	_repId: string;
	created: Date;
	data?: object;
	model?: Model;
	name: string;
}

export interface Infographic {
	_id: string;
	_orgId: string;
	_infographicId: string;
	_repId: string;
	created: Date;
	name: string;
	specification?: Specification;
}

export interface Organisation {
	_id: string;
	_organisations: Organisation[];
	_reports: Report[];
	_infographics: Infographic[];
	avatar: string;
	created: Date;
	description: string;
	isPublic?: boolean;
	isNetwork?: boolean;
	model?: Model;
	name: string;
	specification?: Specification;
}
