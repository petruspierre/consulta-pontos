import { Knex } from 'knex'

declare module 'knex/types/tables.js' {
  interface Partner {
    id: number;
    name: string;
  }

  interface Source {
    id: number;
    name: string;
    url: string;
  }

  interface PartnerSource {
    id: string;
    partner_id: number;
    source_id: number;
    reference: string;
  }

  interface Parity {
    id: string;
    partner_source_id: string;
    currency: string;
    value: number;
    parity: number;
    premium_parity: number;
    created_at: Date;
  }

  interface Tables {
    partner: Partner;
    source: Source;
    partner_source: PartnerSource;
    parity: Parity;
  }
}