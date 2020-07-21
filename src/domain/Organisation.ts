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
	description: string;
	parenttopic?: string;
}

export interface Indicator {
	name?: string;
	description?: string;
	type?: string;
	indicator?: string;
	formula?: string;
	formulameta?: any;
	unit?: string;
	help?: string;
}

export interface IndirectIndicator {

}

export interface DirectIndicator {

}

export interface Model {
	_id: string;
	_orgId: string;
	_repId: string;
	topics?: Topic[];
	certifications?: Certification[];
	indicators: Indicator[];
	surveys?: Survey[];
	name: string;
	reportItems?: Array<any>;
}

export interface Specification {
}

export interface Stakeholdergroup {
	_id: string;
	_orgId: string;
	_sgId: string;
	name: string;
	created?: Date;
	stakeholders?: object;
}

export interface Stakeholder {
	_orgId: string;
	_sId: string;
	_sgId: string;
	name: string;
	firstname: string;
	lastname: string;
	email: string;
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

export interface SurveyResponse {
	_id: string;
	_orgId: string;
	_sId: string;
	repId: string;
	summary: string;
	completed: string;
	fullresponse: string;
	incomplete: string;
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
	_sId: string;
	_repId: string;
	lsId: string;
	created: Date;
	name: string;
	description: string;
	welcometext: string;
	closingtext: string;
	questions: Question[];
	participants: string;
	status: string;
	responserate: number;
	population: string;
	responses?: object;
	respObtained: string;
	validResp: string;
	incompleteResp: string;
}

export interface Question {
 	_qId: string;
	name: string;
	value: string;
	description?: string;
	isMandatory: string;
	answerType?: string;
	responses?: Array<any>;
	indicator?: string;
	qhandler?: string;
	options?: any;
	aggregatedQs?: Array<any>;
	others: boolean;
	order: number;
}

export interface Organisation {
	_id: string;
	_organisations: Organisation[];
	_reports: Report[];
	_infographics?: Infographic[];
	_stakeholdergroups?: Stakeholdergroup;
	_stakeholders?: Stakeholder;
	_surveys?: Survey[];
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
