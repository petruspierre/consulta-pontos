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
				id: "id",
				sourceId: "source_id",
			})
			.where("partner_id", id);

		if (!partner) {
			throw new Error("Partner not found");
		}

		return {
			id: partner.id,
			name: partner.name,
			sources: partnerSources.map((partnerSource) => {
				return {
					id: partnerSource.id,
					sourceId: partnerSource.sourceId,
				};
			}),
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
			query.where("name", "like", `%${params.filter}%`);
		}

		const data = await query;

		return data;
	}
}
