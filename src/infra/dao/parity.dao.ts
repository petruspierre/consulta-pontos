import { db } from "../db/connection.js";

export class ParityDAO {
	async getBySourceId(sourceId: number) {
		const data = await db.raw(
			`
      SELECT 
        s.name as "source_name",
        p.name as "partner_name",
        pr.*
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

	async getHistory(sourceId: number, partnerId: number) {
		const partnerSource = await db
			.from("partner_source")
			.select({
				id: "partner_source.id",
				partnerId: "partner_id",
				partnerName: "partner.name",
				sourceId: "source_id",
				sourceName: "source.name",
			})
			.join("partner", "partner_source.partner_id", "partner.id")
			.join("source", "partner_source.source_id", "source.id")
			.where("partner_id", partnerId)
			.andWhere("source_id", sourceId)
			.first();

		const data = await db
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

		return {
			...partnerSource,
			history: data,
		};
	}
}
