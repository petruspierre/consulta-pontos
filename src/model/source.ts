import { Parity } from "./parity.js";

export type Source = {
  id: number;
  name: string;
  url: string;
  partners: {
    parityId: string;
    reference: string;
  }[]
}