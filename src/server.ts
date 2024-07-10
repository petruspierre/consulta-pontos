import './infra/env.js'

import Fastify from 'fastify'

import { scrapingJob } from "./scraping/index.js";
import { db } from './infra/db/connection.js';

scrapingJob.start()

const server = Fastify({
  logger: true
})

server.get('/source', async (request, reply) => {
  const sources = await db('source').select('*')

  return sources
})

server.get('/partner', async (request, reply) => { 
  const partners = await db('partner').select('*')

  return partners
})

server.get('/source/:sourceId/parity', async (request, reply) => {
  const { sourceId } = request.params as any

  const parities = await db.raw(`
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
  `, [sourceId])

  return parities.rows
})

const startServer = async () => {
  try {
    await server.listen({ port: 3000 })
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

startServer()