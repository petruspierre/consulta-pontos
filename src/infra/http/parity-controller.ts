import type { FastifyReply, FastifyRequest } from "fastify";
import { inject, injectable } from "inversify";

import { USE_CASES } from "@/application/use-cases/container.js";
import type { GetParityBySourceIdUseCase } from "@/application/use-cases/get-parity-by-source-id.js";
import type { SearchQueryParams } from "@/util/search-params.js";
import type {
	GetParityHistoryBySourceIdInput,
	GetParityHistoryBySourceIdUseCase,
} from "@/application/use-cases/get-parity-history-by-source-id.js";

@injectable()
export class ParityController {
	@inject(USE_CASES.GET_PARITY_BY_SOURCE_ID)
	getParityBySourceId!: GetParityBySourceIdUseCase;

	@inject(USE_CASES.GET_PARITY_HISTORY_BY_SOURCE_ID)
	getHistoryBySourceId!: GetParityHistoryBySourceIdUseCase;

	getParitiesBySourceId = async (
		request: FastifyRequest,
		reply: FastifyReply,
	) => {
		const { sourceId } = request.params as { sourceId: number };

		const parities = await this.getParityBySourceId.execute({ sourceId });

		reply.send(parities);
	};

	getParityHistoryBySourceId = async (
		request: FastifyRequest,
		reply: FastifyReply,
	) => {
		const { page, perPage } = request.query as SearchQueryParams;
		const { sourceId, partnerId } = request.params as {
			sourceId: number;
			partnerId: number;
		};

		const parities = await this.getHistoryBySourceId.execute({
			sourceId,
			partnerId,
			page,
			perPage,
		});

		reply.send(parities);
	};
}
