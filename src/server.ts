import "./infra/env.js";

import Fastify from "fastify";

import { SourceDAO } from "./infra/dao/source.dao.js";
import { db } from "./infra/db/connection.js";
import { scrapingJob } from "./scraping/index.js";
import { ParityDAO } from "./infra/dao/parity.dao.js";

scrapingJob.start();

const sourceDAO = new SourceDAO();
const parityDAO = new ParityDAO();

const server = Fastify({
	logger: true,
});

server.get("/source", async (request, reply) => {
	const sources = await sourceDAO.findAll();

	reply.send(sources);
});

server.get("/partner", async (request, reply) => {
	const partners = await db("partner").select("*");

	reply.send(partners);
});

server.get("/source/:sourceId", async (request, reply) => {
	const { sourceId } = request.params as { sourceId: number };

	const source = await sourceDAO.findById(sourceId);

	reply.send(source);
});

server.get("/source/:sourceId/parity", async (request, reply) => {
	const { sourceId } = request.params as { sourceId: number };

	const parities = await parityDAO.getBySourceId(sourceId);

	reply.send(parities);
});

server.get(
	"/source/:sourceId/parity/:parityId/history",
	async (request, reply) => {
		const { sourceId, parityId } = request.params as {
			sourceId: number;
			parityId: number;
		};

		const history = await parityDAO.getHistory(sourceId, parityId);

		reply.send(history);
	},
);

const startServer = async () => {
	try {
		await server.listen({ port: 3000 });
	} catch (err) {
		server.log.error(err);
		process.exit(1);
	}
};

startServer();
