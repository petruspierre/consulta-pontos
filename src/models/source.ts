export type Source = {
	id: number;
	name: string;
	url: string;
	partners: {
		id: number;
		name: string;
	}[];
};
