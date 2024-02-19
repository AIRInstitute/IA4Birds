export type userInputType = {
	username: string;
	name: string;
	surname: string;
	email: string;
	password: string;
	role: number;
	access_token: string;
	password_token: string;
};

export type usersType = {
	id: number;
	username: string;
	name: string;
	surname: string;
	email: string;
	password: string;
	access_token?: string;
	password_token?: string;
	active: boolean;
	created_at: Date;
	role: number;
};

export type rolesType = {
	id: number;
	name: string;
};
