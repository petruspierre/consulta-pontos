import type { FastifyReply, FastifyRequest } from "fastify";
import { inject, injectable } from "inversify";

import { USE_CASES } from "@/application/use-cases/container.js";
import type { GetParityBySourceIdUseCase } from "@/application/use-cases/get-parity-by-source-id.js";

@injectable()
export class ParityController {
	@inject(USE_CASES.GET_PARITY_BY_SOURCE_ID)
	getParityBySourceId!: GetParityBySourceIdUseCase;

	getParitiesBySourceId = async (
		request: FastifyRequest,
		reply: FastifyReply,
	) => {
		const { sourceId } = request.params as { sourceId: number };

		const parities = await this.getParityBySourceId.execute({ sourceId });

		reply.send(parities);
	};
}
