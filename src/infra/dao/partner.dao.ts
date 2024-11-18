import { injectable } from "inversify";

import { SearchParams } from "@/util/search-params.js";
import { db } from "../db/connection.js";

export class PartnerSearchParams extends SearchParams<string> {}

@injectable()
export class PartnerDAO {
	async findById(id: number) {
		const partner = await db("partner")
			.select({
				id: "id",
				name: "name",
			})
			.where("id", id)
			.first();

		const partnerSources = await db("partner_source")
			.select({
				id: "partner_source.id",
				sourceId: "source.id",
				sourceName: "source.name",
				sourceUrl: "source.url",
			})
			.where("partner_id", id)
			.leftJoin("source", "partner_source.source_id", "source.id");

		if (!partner) {
			throw new Error("Partner not found");
		}

		return {
			id: partner.id,
			name: partner.name,
			sources: partnerSources,
		};
	}

	async search(params: PartnerSearchParams) {
		const query = db("partner")
			.select({
				id: "id",
				name: "name",
			})
			.limit(params.perPage)
			.offset((params.page - 1) * params.perPage);

		if (params.sort && params.sortDir) {
			query.orderBy(params.sort, params.sortDir);
		}

		if (params.filter) {
			query.where("name", "ilike", `%${params.filter}%`);
		}

		const data = await query;

		return data;
	}
}
