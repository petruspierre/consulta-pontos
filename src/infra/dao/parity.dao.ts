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

	async getHistory(sourceId: number, parityId: number) {
		const data = await db.raw(
			`
      SELECT 
        s.name as "source_name",
        p.name as "partner_name",
        pr.*
      FROM source s
      JOIN partner_source ps ON ps.source_id = s.id
      JOIN partner p ON p.id = ps.partner_id
      JOIN parity pr ON pr.partner_source_id = ps.id
      WHERE s.id = ?
    `,
			[sourceId],
		);

		return data.rows;
	}
}
