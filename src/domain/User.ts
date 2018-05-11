export type UserOrganisation = {
	_id: string;
	access: number;
	added: Date;
	role: string;
};

export type User = {
	_id: string;
	_isCurrent?: boolean;
	_organisations?: UserOrganisation[];
	avatar: string;
	created: Date;
	email: string;
	emailVerified: boolean;
	lastLogin: Date;
	name: string;
};

export type UserCollection = User[];
