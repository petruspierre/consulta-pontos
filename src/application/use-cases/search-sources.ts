import { inject, injectable } from "inversify";

import { SourceSearchParams, type SourceDAO } from "@/infra/dao/source.dao.js";
import type {
	PaginatedOutput,
	SearchQueryParams,
} from "@/util/search-params.js";
import { DAOS } from "@/infra/dao/container.js";

export type SearchSourcesInput = SearchQueryParams;

export type SearchSourcesOutput = PaginatedOutput<{
	id: number;
	name: string;
	url: string;
}>;

@injectable()
export class SearchSourcesUseCase {
	@inject(DAOS.SOURCE)
	private sourceDAO!: SourceDAO;

	async execute(input: SearchSourcesInput): Promise<SearchSourcesOutput> {
		const searchParams = new SourceSearchParams({
			filter: input.filter,
			page: input.page,
			perPage: input.perPage,
			sort: input.sort,
			sortDir: input.sortDir,
		});

		const sources = await this.sourceDAO.search(searchParams);

		return {
			data: sources,
			meta: {
				page: searchParams.page,
				perPage: searchParams.perPage,
			},
		};
	}
}
