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
		await db.transaction(async (trx) => {
			for (const entry of Object.entries(results)) {
				const [
					sourcePartnerId,
					{ currency, value, parity, url, premiumParity },
				] = entry;
				const data = {
					partner_source_id: sourcePartnerId,
					currency,
					value,
					parity,
					url,
					premium_parity: premiumParity,
				};

				const existingParityForToday = await trx("parity")
					.where("partner_source_id", sourcePartnerId)
					.andWhere("created_at", ">=", db.raw("CURRENT_DATE"))
					.first();

				if (existingParityForToday) {
					if (existingParityForToday.parity >= parity) {
						console.log("Parity already exists and is higher than the new one");
						continue;
					}

					console.log("Updating existing parity");

					await trx("parity")
						.where("id", existingParityForToday.id)
						.update(data);
					continue;
				}

				console.log("Inserting new parity");

				await trx("parity").insert(data);
			}
		});
	}
}
