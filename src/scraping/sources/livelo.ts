import { propertyOf } from "@/util/propertyOf.js";
import type { Page } from "puppeteer";
import { type ScrapingResult, ScrapingSource } from "./index.js";

export type LiveloSourceReference = {
	title: string;
};

export class LiveloSource extends ScrapingSource {
	selectors = {
		affiliateCards: ".parity__card",
		cardImage: "img.parity__card--img",
		currency: '[data-bind="text: $data.currency"]',
		value: '[data-bind="text: $data.value"]',
		parity: '[data-bind="text: $data.parity"]',
		extendedPremiumParity: '[data-bind="text: $data.extended_parity_clube"]',
		extendedNormalParity: '[data-bind="text: $data.extended_parity"]',
		url: ".button__knowmore--link",
	};

	async run(page: Page) {
		console.log("Livelo source running...");
		const source = await this.loadSource();

		console.log('Source URL:', source.url);

		await page.goto(source.url, { waitUntil: "domcontentloaded" });

		console.log('Page loaded');
		await page.setViewport({ width: 1080, height: 1024 });

		await page.waitForSelector(this.selectors.affiliateCards);
		console.log('Parity cards loaded');
		const cards = await page.$$(this.selectors.affiliateCards);

		console.log('Cards:', cards.length);
		const result = {} as ScrapingResult;

		const sourcePartners = source.partners.reduce(
			(acc, partner) => {
				const { title = "" } = partner.reference as LiveloSourceReference;
				acc[title] = partner.id;
				return acc;
			},
			{} as Record<string, string>,
		);

		for (const card of cards) {
			console.log(`Processing card ${cards.indexOf(card) + 1}/${cards.length}`);
			const image = await this.getElementOrThrow<HTMLImageElement>(
				card,
				this.selectors.cardImage,
			);
			const title = await image?.evaluate((node) => node.alt);

			if (!title) {
				console.log(`Skipping card ${cards.indexOf(card) + 1}. Missing title.`);
				continue;
			}

			const sourcePartnerId = sourcePartners[title];

			if (!sourcePartnerId) {
				console.log(`Skipping ${title} card. Missing source partner id.`);
				continue;
			}

			let currency: string | null = null;
			let value: string | null = null;
			let parity: string | null = null;
			let premiumParity: string | null = null;

			const extendedPremiumParity = await this.getTextFromElement(
				card,
				this.selectors.extendedPremiumParity,
			);
			const extendedNormalParity = await this.getTextFromElement(
				card,
				this.selectors.extendedNormalParity,
			);

			if (extendedPremiumParity) {
				[currency, value, , premiumParity] = extendedPremiumParity.split(" ");
			} else {
				currency = await this.getTextFromElement(card, this.selectors.currency);
				value = await this.getTextFromElement(card, this.selectors.value);
			}

			if (extendedNormalParity) {
				parity = extendedNormalParity.split(" ")[2];
			} else {
				parity = await this.getTextFromElement(card, this.selectors.parity);
			}

			const urlElement = await this.getElementOrThrow(card, this.selectors.url);
			const url = await urlElement?.evaluate((node) =>
				node.getAttribute("href"),
			);

			if (
				!value ||
				!parity ||
				!currency ||
				!propertyOf(currency, this.currencyMap)
			) {
				console.log(`
					Skipping ${title} card. Missing data.
						currency: ${!!currency}
						value: ${!!value}
						parity: ${!!parity}
						url: ${!!url}
						currencyExists: ${!!propertyOf(currency!, this.currencyMap)}
					`);
				continue;
			}

			result[sourcePartnerId] = {
				currency: this.currencyMap[currency],
				value: Number.parseFloat(value.replace(",", ".")),
				parity: Number.parseFloat(parity.replace(",", ".")),
				premiumParity: premiumParity
					? Number.parseFloat(premiumParity.replace(",", "."))
					: null,
			};
		}

		await this.saveResults(result);
	}
}
