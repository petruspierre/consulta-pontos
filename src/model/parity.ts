export type Parity = {
  partnerId: number;
  sourceId: number;
  reference: string;
  url?: string;
  currency: string;
  value: number;
  parity: number;
  premium_parity?: number;
}