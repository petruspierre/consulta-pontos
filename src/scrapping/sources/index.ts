import { Source } from "@/entities/source.js";
import { db } from "@/infra/db/connection.js";
import { SourceRepository } from "@/infra/repositories/source.repository.js";
import { ElementHandle, Page } from "puppeteer";

export type ScrappingResult = Record<string, {
  currency: string,
  value: number,
  parity: number,
  url: string
}>

export abstract class ScrappingSource { 
  currencyMap = {
    'R$': 'BRL'
  } as const

  constructor(private sourceRepository: SourceRepository, private sourceId: number) { }

  protected getTextFromElement = async (parent: ElementHandle | Page, selector: string) => {
    const element = await parent.$(selector)
    return (element?.evaluate(node => node.textContent)) || ''
  }

  protected async getElementOrThrow<T extends Element = Element>(parent: ElementHandle | Page, selector: string) {
    const element = (await parent.$(selector)) as ElementHandle<T> | null
    if (!element) {
      throw new Error(`Element not found: ${selector}`)
    }
    return element
  }

  protected async loadSource() {
    return await this.sourceRepository.findById(this.sourceId)
  }

  protected async saveResults(results: ScrappingResult) {
    console.log('Saving results', results)
    const data = Object.entries(results).map(([sourcePartnerId, { currency, value, parity, url }]) => ({
      partner_source_id: sourcePartnerId,
      currency,
      value,
      parity,
      url,
    }))
    await db('parity').insert(data)
  }
}