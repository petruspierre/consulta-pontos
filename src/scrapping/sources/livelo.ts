import { Page } from 'puppeteer'
import { ScrappingSource } from './index.js';

export class LiveloSource extends ScrappingSource {
  selectors = {
    affiliateCards: '.parity__card'
  }

  async run(page: Page) {
    console.log('Livelo source running.');
    await page.goto('https://www.livelo.com.br/ganhe-pontos-compre-e-pontue');
    await page.setViewport({ width: 1080, height: 1024 });

    await page.waitForSelector(this.selectors.affiliateCards);
    const cards = await page.$$(this.selectors.affiliateCards);

    for (const card of cards) {
      const image = await card.$('img.parity__card--img');
      const title = await image?.evaluate(node => node.alt);
      const base = await card.$('[data-bind="text: $data.parity"]')
      const parity = await base?.evaluate(node => node.textContent);
      console.log('Title:', title, 'Points: ', parity);
    }
  }
}