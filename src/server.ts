import "./infra/env.js";
import "reflect-metadata";

import Fastify from "fastify";

import { SourceDAO, SourceSearchParams } from "./infra/dao/source.dao.js";
import { db } from "./infra/db/connection.js";
import { scrapingJob } from "./scraping/index.js";
import {
	ParityDAO,
	ParityHistorySearchParams,
} from "./infra/dao/parity.dao.js";
import { env } from "./infra/env.js";
import { verifyKey } from "@unkey/api";
import type { SearchQueryParams } from "./util/search-params.js";
import { appContainer } from "./container.js";
import type { SourceController } from "./infra/http/source-controller.js";
import { CONTROLLERS } from "./infra/http/container.js";
import type { PartnerController } from "./infra/http/partner-controller.js";

scrapingJob.start();

const parityDAO = new ParityDAO();

const sourceController = appContainer.get<SourceController>(CONTROLLERS.SOURCE);
const partnerController = appContainer.get<PartnerController>(
	CONTROLLERS.PARTNER,
);

const server = Fastify({
	logger: true,
});

const authenticate: Fastify.onRequestAsyncHookHandler = async (
	request,
	reply,
) => {
	if (env.ENVIRONMENT === "development") {
		return;
	}

	const authHeader = request.headers.authorization;
	const key = authHeader?.toString().replace("Bearer ", "");

	if (!key) {
		return reply.code(401).send({ error: "Unauthorized" });
	}

	const { result, error } = await verifyKey(key);

	if (error) {
		return reply.code(500).send({ error: "Internal Server Error" });
	}

	if (!result.valid) {
		return reply.code(401).send({ error: "Unauthorized" });
	}
};

server.addHook("onRequest", authenticate);

server.get("/source", sourceController.search);
server.get("/source/:sourceId", sourceController.findById);

server.get("/partner", partnerController.search);
server.get("/partner/:partnerId", partnerController.findById);

server.get("/source/:sourceId/parity", async (request, reply) => {
	const { sourceId } = request.params as { sourceId: number };

	const parities = await parityDAO.getBySourceId(sourceId);

	reply.send(parities);
});

server.get(
	"/source/:sourceId/parity/:parityId/history",
	async (request, reply) => {
		const { page, perPage } = request.query as SearchQueryParams;
		const searchParams = new ParityHistorySearchParams({
			page,
			perPage,
		});

		const { sourceId, parityId } = request.params as {
			sourceId: number;
			parityId: number;
		};

		const history = await parityDAO.getHistory(
			sourceId,
			parityId,
			searchParams,
		);

		reply.send({
			data: history,
			meta: {
				page: searchParams.page,
				perPage: searchParams.perPage,
			},
		});
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
