import { DAOS } from "@/infra/dao/container.js";
import {
	ParityHistorySearchParams,
	type ParityDAO,
} from "@/infra/dao/parity.dao.js";
import type {
	PaginatedOutput,
	SearchQueryParams,
} from "@/util/search-params.js";
import { inject, injectable } from "inversify";

export type GetParityHistoryBySourceIdInput = {
	sourceId: number;
	partnerId: number;
} & SearchQueryParams;

export type GetParityHistoryBySourceIdOutput = PaginatedOutput<{
	id: string;
	partnerId: number;
	partnerName: string;
	sourceId: number;
	sourceName: string;
	history: {
		parityId: string;
		currency: string;
		value: number;
		parity: number;
		premiumParity: number | null;
		createdAt: Date;
	}[];
}>;

@injectable()
export class GetParityHistoryBySourceIdUseCase {
	@inject(DAOS.PARITY)
	private parityDAO!: ParityDAO;

	async execute(
		input: GetParityHistoryBySourceIdInput,
	): Promise<GetParityHistoryBySourceIdOutput> {
		const { partnerId, sourceId, page, perPage } = input;

		const searchParams = new ParityHistorySearchParams({
			page,
			perPage,
		});

		const history = await this.parityDAO.getHistory(
			sourceId,
			partnerId,
			searchParams,
		);

		return {
			data: history,
			meta: {
				page: searchParams.page,
				perPage: searchParams.perPage,
			},
		};
	}
}
