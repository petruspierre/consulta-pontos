import type { FastifyReply, FastifyRequest } from "fastify";
import { inject, injectable } from "inversify";

import { USE_CASES } from "@/application/use-cases/container.js";
import type { SearchSourcesUseCase } from "@/application/use-cases/search-sources.js";
import type { SearchQueryParams } from "@/util/search-params.js";

@injectable()
export class SourceController {
	@inject(USE_CASES.SEARCH_SOURCES)
	searchSourceUseCase!: SearchSourcesUseCase;

	search = async (req: FastifyRequest, reply: FastifyReply) => {
		const { page, perPage, filter, sort, sortDir } =
			req.query as SearchQueryParams;

		const sources = await this.searchSourceUseCase.execute({
			page,
			perPage,
			filter,
			sort,
			sortDir,
		});

		reply.send(sources);
	};
}
