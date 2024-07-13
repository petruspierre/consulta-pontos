import { Knex } from "knex";

declare module "knex/types/tables.js" {
	interface PartnerTable {
		id: number;
		name: string;
	}

	interface SourceTable {
		id: number;
		name: string;
		url: string;
	}

	interface PartnerSourceTable {
		id: string;
		partner_id: number;
		source_id: number;
		reference: string;
	}

	interface ParityTable {
		id: string;
		partner_source_id: string;
		currency: string;
		value: number;
		parity: number;
		premium_parity: number | null;
		created_at: Date;
	}

	interface Tables {
		partner: PartnerTable;
		source: SourceTable;
		partner_source: PartnerSourceTable;
		parity: ParityTable;
	}
}
