import "./infra/env.js";
import "reflect-metadata";

import Fastify from "fastify";

import { scrapingJob, startScraping } from "./scraping/index.js";
import { env } from "./infra/env.js";
import { appContainer } from "./container.js";
import type { SourceController } from "./infra/http/source-controller.js";
import { CONTROLLERS } from "./infra/http/container.js";
import type { PartnerController } from "./infra/http/partner-controller.js";
import type { ParityController } from "./infra/http/parity-controller.js";

scrapingJob.start();

const setupApi = async () => {
	const sourceController = appContainer.get<SourceController>(CONTROLLERS.SOURCE);
	const partnerController = appContainer.get<PartnerController>(
		CONTROLLERS.PARTNER,
	);
	const parityController = appContainer.get<ParityController>(CONTROLLERS.PARITY);
	
	const server = Fastify({
		logger: true,
	});
	
	await server.register(import('@fastify/rate-limit'), {
		max: 150,
		timeWindow: '1 day',
	})
	
	server.get("/v1/source", sourceController.search);
	server.get("/v1/source/:sourceId", sourceController.findById);
	
	server.get("/v1/partner", partnerController.search);
	server.get("/v1/partner/:partnerId", partnerController.findById);
	
	server.get("/v1/parity/source/:sourceId", parityController.getParitiesBySourceId);
	
	server.get(
		"/v1/parity/source/:sourceId/partner/:partnerId/history",
		parityController.getParityHistoryBySourceId,
	);
	
	server.post("/v1/refresh", async (request, reply) => {
		startScraping();
		return reply.send({ message: "Scraping job started" });
	});
	
	const startServer = async () => {
		try {
			await server.listen({ port: env.PORT });
		} catch (err) {
			server.log.error(err);
			process.exit(1);
		}
	};
	
	startServer();
}

setupApi();