import { Page } from 'puppeteer'
import { ScrappingSource } from './index.js';
import { propertyOf } from '@/util/propertyOf.js';

export type LiveloSourceReference = {
  title: string
}

export class LiveloSource extends ScrappingSource {
  selectors = {
    affiliateCards: '.parity__card'
  }

  async run(page: Page) {
    console.log('Livelo source running...');
    const source = await this.loadSource()

    await page.goto('https://www.livelo.com.br/ganhe-pontos-compre-e-pontue');
    await page.setViewport({ width: 1080, height: 1024 });

    await page.waitForSelector(this.selectors.affiliateCards);
    const cards = await page.$$(this.selectors.affiliateCards);

    const result = {} as any

    const sourcePartners = source.partners.reduce((acc, partner) => { 
      const { title = '' } = partner.reference as LiveloSourceReference
      acc[title] = partner.id
      return acc
    }, {} as Record<string, any>)

    for (const card of cards) {
      const image = await card.$('img.parity__card--img');
      const title = await image?.evaluate(node => node.alt);

      if (!title) {
        continue
      }

      const sourcePartnerId = sourcePartners[title];

      if (!sourcePartnerId) {
        continue;
      }

      const baseCurrency = await card.$('[data-bind="text: $data.currency"]')
      const currency = await baseCurrency?.evaluate(node => node.textContent);

      const baseValue = await card.$('[data-bind="text: $data.value"]')
      const value = await baseValue?.evaluate(node => node.textContent);

      const basePoints = await card.$('[data-bind="text: $data.parity"]')
      const parity = await basePoints?.evaluate(node => node.textContent);

      // const baseURL = await card.$('.button__knowmore--link gtm-link-event')
      // const url = await baseURL?.evaluate(node => node.getAttribute('href'));

      // console.log(url)

      if (!value || !parity || !currency || !propertyOf(currency, this.currencyMap)) {
        continue;
      }

      result[sourcePartnerId] = {
        currency: this.currencyMap[currency],
        value: parseFloat(value.replace(',', '.')),
        parity: parseFloat(parity.replace(',', '.')),
        url: ""
      }
    }

    await this.saveResults(result)
  }
}