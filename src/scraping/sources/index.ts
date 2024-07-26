import type { SourceDAO } from "@/infra/dao/source.dao.js";
import { db } from "@/infra/db/connection.js";
import type { ElementHandle, Page } from "puppeteer";

export type ScrapingResult = Record<
	string,
	{
		currency: string;
		value: number;
		parity: number;
		url: string;
		premiumParity: number | null;
	}
>;

export abstract class ScrapingSource {
	currencyMap = {
		R$: "BRL",
		U$: "USD",
	} as const;

	constructor(
		private sourceDAO: SourceDAO,
		private sourceId: number,
	) {}

	protected getTextFromElement = async (
		parent: ElementHandle | Page,
		selector: string,
	) => {
		const element = await parent.$(selector);
		return element?.evaluate((node) => node.textContent) || "";
	};

	protected async getElementOrThrow<T extends Element = Element>(
		parent: ElementHandle | Page,
		selector: string,
	) {
		const element = (await parent.$(selector)) as ElementHandle<T> | null;
		if (!element) {
			throw new Error(`Element not found: ${selector}`);
		}
		return element;
	}

	protected async loadSource() {
		return await this.sourceDAO.findById(this.sourceId);
	}

	protected async saveResults(results: ScrapingResult) {
		const data = Object.entries(results).map(
			([sourcePartnerId, { currency, value, parity, url, premiumParity }]) => ({
				partner_source_id: sourcePartnerId,
				currency,
				value,
				parity,
				url,
				premium_parity: premiumParity,
			}),
		);
		await db("parity").insert(data);
	}
}
