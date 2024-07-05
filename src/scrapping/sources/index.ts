import { Source } from "@/entities/source.js";
import { db } from "@/infra/db/connection.js";
import { SourceRepository } from "@/infra/repositories/source.repository.js";

export abstract class ScrappingSource { 
  currencyMap = {
    'R$': 'BRL'
  } as const

  constructor(private sourceRepository: SourceRepository, private sourceId: number) { }

  protected async loadSource() {
    return await this.sourceRepository.findById(this.sourceId)
  }

  protected async saveResults(results: Record<string, { currency: string, value: number, parity: number }>) {
    console.log('Saving results', results)
    const data = Object.entries(results).map(([sourcePartnerId, { currency, value, parity }]) => ({
      partner_source_id: sourcePartnerId,
      currency,
      value,
      parity,
      url: '',
    }))
    await db('parity').insert(data)
  }
}