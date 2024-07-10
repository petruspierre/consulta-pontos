import "./infra/env.js";

import Fastify from "fastify";

import { SourceDAO } from "./infra/dao/source.dao.js";
import { db } from "./infra/db/connection.js";
import { scrapingJob } from "./scraping/index.js";

scrapingJob.start();

const sourceDAO = new SourceDAO();

const server = Fastify({
	logger: true,
});

server.get("/source", async (request, reply) => {
	const sources = await sourceDAO.findAll();

	return sources;
});

server.get("/partner", async (request, reply) => {
	const partners = await db("partner").select("*");

	return partners;
});

server.get("/source/:sourceId/parity", async (request, reply) => {
	const { sourceId } = request.params as { sourceId: string };

	const parities = sourceDAO.getWithParities(sourceId);

	return parities;
});

const startServer = async () => {
	try {
		await server.listen({ port: 3000 });
	} catch (err) {
		server.log.error(err);
		process.exit(1);
	}
};

startServer();
