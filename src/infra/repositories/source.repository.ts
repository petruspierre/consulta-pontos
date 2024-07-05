import { Source, SourcePartner } from "@/entities/source.js";
import { db } from "../db/connection.js";

export class SourceRepository {
  async findById(id: number) { 
    const source = await db('source')
      .select({
        id: 'id',
        name: 'name',
        url: 'url'
      })
      .where('id', id)
      .first()

    const sourcePartners = await db('partner_source')
      .select({
        id: 'id',
        partnerId: 'partner_id',
        reference: 'reference'
      })
      .where('source_id', id)
    
    if (!source) {
      throw new Error('Source not found')
    }

    return new Source(
      {
        name: source.name,
        url: source.url,
        partners: sourcePartners.map(sourcePartner => {
          return new SourcePartner(
            {
              partnerId: sourcePartner.partnerId,
                reference: JSON.parse(JSON.stringify(sourcePartner.reference))
            },
            sourcePartner.id
          )
        })
      },
      source.id
    )
  }
}