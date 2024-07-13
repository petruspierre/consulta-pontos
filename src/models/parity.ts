export type Parity = {
	id: string;
	partnerSourceId: string;
	currency: string;
	value: number;
	parity: number;
	premiumParity: number | null;
	createdAt: Date;
};
