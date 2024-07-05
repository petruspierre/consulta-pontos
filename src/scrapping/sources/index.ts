import { Source } from "@/entities/source.js";
import { SourceRepository } from "@/infra/repositories/source.repository.js";

export abstract class ScrappingSource { 
  currencyMap = {
    'R$': 'BRL'
  } as const

  constructor(private sourceRepository: SourceRepository, private sourceId: number) { }

  protected async loadSource() {
    return await this.sourceRepository.findById(this.sourceId)
  }
}