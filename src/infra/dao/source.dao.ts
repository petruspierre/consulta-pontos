import { SearchParams } from "@/util/search-params.js";
import { db } from "../db/connection.js";

export class SourceSearchParams extends SearchParams<string> {}

export class SourceDAO {
	async findById(id: number) {
		const source = await db("source")
			.select({
				id: "id",
				name: "name",
				url: "url",
			})
			.where("id", id)
			.first();

		const sourcePartners = await db("partner_source")
			.select({
				id: "id",
				partnerId: "partner_id",
				reference: "reference",
			})
			.where("source_id", id);

		if (!source) {
			throw new Error("Source not found");
		}

		return {
			id: source.id,
			name: source.name,
			url: source.url,
			partners: sourcePartners.map((sourcePartner) => {
				return {
					id: sourcePartner.id,
					partnerId: sourcePartner.partnerId,
					reference: JSON.parse(JSON.stringify(sourcePartner.reference)),
				};
			}),
		};
	}

	async findAll() {
		const data = await db("source").select({
			id: "id",
			name: "name",
			url: "url",
		});

		return data;
	}

	async search(params: SourceSearchParams) {
		const query = db("source")
			.select({
				id: "id",
				name: "name",
				url: "url",
			})
			.limit(params.per_page)
			.offset((params.page - 1) * params.per_page);

		if (params.sort && params.sort_dir) {
			query.orderBy(params.sort, params.sort_dir);
		}

		if (params.filter) {
			query.where("name", "like", `%${params.filter}%`);
		}

		const data = await query;

		return data;
	}
}
