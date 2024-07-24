import "./infra/env.js";

import Fastify from "fastify";

import { SourceDAO, SourceSearchParams } from "./infra/dao/source.dao.js";
import { db } from "./infra/db/connection.js";
import { scrapingJob } from "./scraping/index.js";
import { ParityDAO } from "./infra/dao/parity.dao.js";
import { env } from "./infra/env.js";

scrapingJob.start();

const sourceDAO = new SourceDAO();
const parityDAO = new ParityDAO();

const server = Fastify({
	logger: true,
});

type SearchQueryParams = {
	page?: string;
	per_page?: string;
	filter?: string;
	sort?: string;
	sort_dir?: string;
};

server.get("/source", async (request, reply) => {
	const { page, per_page, filter, sort, sort_dir } =
		request.query as SearchQueryParams;
	const searchParams = new SourceSearchParams({
		filter,
		page,
		per_page,
		sort,
		sort_dir,
	});
	const sources = await sourceDAO.search(searchParams);

	reply.send({
		data: sources,
		meta: {
			page: searchParams.page,
			per_page: searchParams.per_page,
		},
	});
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
		await server.listen({ port: env.PORT });
	} catch (err) {
		server.log.error(err);
		process.exit(1);
	}
};

startServer();
