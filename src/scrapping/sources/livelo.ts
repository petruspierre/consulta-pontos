import { Page } from 'puppeteer'
import { ScrappingSource } from './index.js';
import { Source } from '@/model/source.js';
import { propertyOf } from '@/util/propertyOf.js';

export class LiveloSource extends ScrappingSource {
  source: Source = {
    id: 1,
    name: 'Livelo',
    url: 'https://www.livelo.com.br/',
    partners: [
      {
        parityId: '2ea5cf4f-648f-4dd7-b344-75108b5e498e',
        reference: 'Magalu'
      }
    ]
  }

  selectors = {
    affiliateCards: '.parity__card'
  }

  async run(page: Page) {
    const currencyMap = {
      'R$': 'BRL'
    } as const

    console.log('Livelo source running.');
    await page.goto('https://www.livelo.com.br/ganhe-pontos-compre-e-pontue');
    await page.setViewport({ width: 1080, height: 1024 });

    await page.waitForSelector(this.selectors.affiliateCards);
    const cards = await page.$$(this.selectors.affiliateCards);

    const result = {} as any

    for (const card of cards) {
      const image = await card.$('img.parity__card--img');
      const title = await image?.evaluate(node => node.alt);

      const baseCurrency = await card.$('[data-bind="text: $data.currency"]')
      const currency = await baseCurrency?.evaluate(node => node.textContent);

      const baseValue = await card.$('[data-bind="text: $data.value"]')
      const value = await baseValue?.evaluate(node => node.textContent);

      const basePoints = await card.$('[data-bind="text: $data.parity"]')
      const parity = await basePoints?.evaluate(node => node.textContent);

      const sourcePartner = this.source.partners.find(partner => partner.reference === title);

      if (!value || !parity || !currency || !propertyOf(currency, currencyMap)) {
        continue;
      }

      if (!sourcePartner) {
        continue;
      }

      result[sourcePartner.parityId] = {
        currency: currencyMap[currency],
        value: parseFloat(value.replace(',', '.')),
        parity: parseFloat(parity.replace(',', '.'))
      }

      console.log('Loaded partner:', title, 'with value:', value, 'and parity:', parity)
    }

    console.log(result)

    return result
  }
}