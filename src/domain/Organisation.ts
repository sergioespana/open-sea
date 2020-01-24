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

export interface Topic {
	name: string;
}

export interface Indicator {

}

export interface IndirectIndicator {

}

export interface DirectIndicator {

}

export interface Model {
	_id: string;
	topics?: Topic[];
	certifications?: Certification[];
	indicators: Indicator[];
	indirectIndicators: IndirectIndicator[];
	directIndicators: DirectIndicator[];
	name: string;
	reportItems?: Array<any>;
}

export interface Specification {
}

export interface StakeholderGroup {
	_id: string;
	_orgId: string;
	_sgId: string;
	name: string;
	created: Date;
}

export interface Stakeholder {
	_id: string;
	_orgId: string;
	_sId: string;
	sgId: string;
	name: string;
	//firstName: string;
	//lastName: string;
	eMail: string;
}

export interface Report {
	_id: string;
	_orgId: string;
	_repId: string;
	created: Date;
	data?: object;
	model?: Model;
	survey?: Survey;
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

export interface Survey {
	_id: string;
	_orgId: string;
	_repId: string;
	created: Date;
	name: string;
	sId: string;
	description: string;
	welcometext: string;
	closingtext: string;
}

export interface Organisation {
	_id: string;
	_organisations: Organisation[];
	_reports: Report[];
	_infographics?: Infographic[];
	_stakeholderGroups?: StakeholderGroup[];
	_stakeholders?: Stakeholder[];
	avatar: string;
	created: Date;
	description: string;
	isPublic?: boolean;
	isNetwork?: boolean;
	model?: Model;
	name: string;
	specification?: Specification;
	ls_account?: string;
	ls_password?: string;
	ls_host?: string;
}
