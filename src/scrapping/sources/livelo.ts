import { Page } from 'puppeteer'
import { ScrappingResult, ScrappingSource } from './index.js';
import { propertyOf } from '@/util/propertyOf.js';

export type LiveloSourceReference = {
  title: string
}

export class LiveloSource extends ScrappingSource {
  selectors = {
    affiliateCards: '.parity__card',
    cardImage: 'img.parity__card--img',
    currency: '[data-bind="text: $data.currency"]',
    value: '[data-bind="text: $data.value"]',
    parity: '[data-bind="text: $data.parity"]',
    url: '.button__knowmore--link'
  }

  async run(page: Page) {
    console.log('Livelo source running...');
    const source = await this.loadSource()

    await page.goto(source.url, { waitUntil: 'domcontentloaded' });
    await page.setViewport({ width: 1080, height: 1024 });

    await page.waitForSelector(this.selectors.affiliateCards);
    const cards = await page.$$(this.selectors.affiliateCards);

    const result = {} as ScrappingResult

    const sourcePartners = source.partners.reduce((acc, partner) => { 
      const { title = '' } = partner.reference as LiveloSourceReference
      acc[title] = partner.id
      return acc
    }, {} as Record<string, any>)

    for (const card of cards) {
      const image = await this.getElementOrThrow<HTMLImageElement>(card, this.selectors.cardImage);
      const title = await image?.evaluate(node => node.alt);

      if (!title) {
        continue
      }

      const sourcePartnerId = sourcePartners[title];

      if (!sourcePartnerId) {
        continue;
      }

      const currency = await this.getTextFromElement(card, this.selectors.currency)
      const value = await this.getTextFromElement(card, this.selectors.value)
      const parity = await this.getTextFromElement(card, this.selectors.parity)

      const urlElement = await this.getElementOrThrow(card, this.selectors.url)
      const url = await urlElement?.evaluate(node => node.getAttribute('href'));

      if (!value || !parity || !currency ||!url || !propertyOf(currency, this.currencyMap)) {
        continue;
      }

      result[sourcePartnerId] = {
        currency: this.currencyMap[currency],
        value: parseFloat(value.replace(',', '.')),
        parity: parseFloat(parity.replace(',', '.')),
        url
      }
    }

    await this.saveResults(result)
  }
}