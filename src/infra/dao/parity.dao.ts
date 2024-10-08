import { SearchParams } from "@/util/search-params.js";
import { db } from "../db/connection.js";
import { injectable } from "inversify";

export class ParityHistorySearchParams extends SearchParams<undefined> {}

@injectable()
export class ParityDAO {
	async getBySourceId(sourceId: number) {
		const data = await db.raw(
			`
      SELECT 
        s.name as "sourceName",
				s.id as "sourceId",
        p.name as "partnerName",
				p.id as "partnerId",
        pr.id as "parityId",
				pr.partner_source_id as "partnerSourceId",
				pr.currency as "currency",
				pr.value as "value",
				pr.parity as "parity",
				pr.premium_parity as "premiumParity",
				pr.created_at as "createdAt"
      FROM source s
      JOIN partner_source ps ON ps.source_id = s.id
      JOIN partner p ON p.id = ps.partner_id
      JOIN (
        SELECT DISTINCT ON (partner_source_id)
          *
        FROM parity
        ORDER BY partner_source_id, created_at DESC
      ) pr ON pr.partner_source_id = ps.id
      WHERE s.id = ?
    `,
			[sourceId],
		);

		return data.rows;
	}

	async getHistory(
		sourceId: number,
		partnerId: number,
		searchParams: ParityHistorySearchParams,
	) {
		const partnerSource = await db
			.from("partner_source")
			.select({
				id: "partner_source.id",
				partnerId: "partner_id",
				partnerName: "partner.name",
				sourceId: "source_id",
				sourceName: "source.name"
			})
			.join("partner", "partner_source.partner_id", "partner.id")
			.join("source", "partner_source.source_id", "source.id")
			.where("partner_id", partnerId)
			.andWhere("source_id", sourceId)
			.first();

		const query = db
			.from("parity")
			.select({
				parityId: "parity.id",
				currency: "parity.currency",
				value: "parity.value",
				parity: "parity.parity",
				premiumParity: "parity.premium_parity",
				createdAt: "parity.created_at",
			})
			.join("partner_source", "parity.partner_source_id", "partner_source.id")
			.where("partner_source.id", partnerSource.id)
			.orderBy("parity.created_at", "desc");

		if (searchParams) {
			query
				.limit(searchParams.perPage)
				.offset(searchParams.perPage * (searchParams.page - 1));
		}

		const data = await query;

		return {
			...partnerSource,
			history: data,
		};
	}
}
