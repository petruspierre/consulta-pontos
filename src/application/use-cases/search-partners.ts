import { inject, injectable } from "inversify";

import {
	PartnerSearchParams,
	type PartnerDAO,
} from "@/infra/dao/partner.dao.js";
import type {
	PaginatedOutput,
	SearchQueryParams,
} from "@/util/search-params.js";
import { DAOS } from "@/infra/dao/container.js";

export type SearchPartnersInput = SearchQueryParams;

export type SearchPartnersOutput = PaginatedOutput<
	{
		id: number;
		name: string;
	}[]
>;

@injectable()
export class SearchPartnersUseCase {
	@inject(DAOS.PARTNER)
	private partnerDAO!: PartnerDAO;

	async execute(input: SearchPartnersInput): Promise<SearchPartnersOutput> {
		const searchParams = new PartnerSearchParams({
			filter: input.filter,
			page: input.page,
			perPage: input.perPage,
			sort: input.sort,
			sortDir: input.sortDir,
		});

		const partners = await this.partnerDAO.search(searchParams);

		return {
			data: partners,
			meta: {
				page: searchParams.page,
				perPage: searchParams.perPage,
			},
		};
	}
}
