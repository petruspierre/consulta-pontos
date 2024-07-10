export interface SourceProps {
	name: string;
	url: string;
	partners: SourcePartner[];
}

export class Source {
	id: number;
	name: string;
	url: string;
	partners: SourcePartner[] = [];

	constructor(props: SourceProps, id: number) {
		this.id = id;
		this.name = props.name;
		this.url = props.url;
		this.partners = props.partners;
	}
}

export interface SourcePartnerProps {
	partnerId: number;
	reference: Record<string, unknown>;
}

export class SourcePartner {
	id: string;
	partnerId: number;
	reference: Record<string, unknown>;

	constructor(props: SourcePartnerProps, id: string) {
		this.id = id;
		this.partnerId = props.partnerId;
		this.reference = props.reference;
	}
}
