import type { FastifyReply, FastifyRequest } from "fastify";
import { inject, injectable } from "inversify";

import { USE_CASES } from "@/application/use-cases/container.js";
import type { SearchPartnersUseCase } from "@/application/use-cases/search-partners.js";
import type { SearchQueryParams } from "@/util/search-params.js";
import type { FindPartnerByIdUseCase } from "@/application/use-cases/find-partner-by-id.js";

@injectable()
export class PartnerController {
	@inject(USE_CASES.SEARCH_PARTNERS)
	searchPartnerUseCase!: SearchPartnersUseCase;

	@inject(USE_CASES.FIND_PARTNER_BY_ID)
	findPartnerByIdUseCase!: FindPartnerByIdUseCase;

	search = async (req: FastifyRequest, reply: FastifyReply) => {
		const { page, perPage, filter, sort, sortDir } =
			req.query as SearchQueryParams;

		const partners = await this.searchPartnerUseCase.execute({
			page,
			perPage,
			filter,
			sort,
			sortDir,
		});

		reply.send(partners);
	};

	findById = async (req: FastifyRequest, reply: FastifyReply) => {
		const { partnerId } = req.params as { partnerId: number };

		const partner = await this.findPartnerByIdUseCase.execute({ partnerId });

		reply.send(partner);
	};
}
