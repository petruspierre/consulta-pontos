import { inject, injectable } from "inversify";

import type { SourceDAO } from "@/infra/dao/source.dao.js";
import { DAOS } from "@/infra/dao/container.js";

export type FindSourceByIdInput = {
	sourceId: number;
};

export type FindSourceByIdOutput = {
	id: number;
	name: string;
	url: string;
	partners: {
		id: string;
		partnerId: number;
		reference: unknown;
	}[];
};

@injectable()
export class FindSourceByIdUseCase {
	@inject(DAOS.SOURCE)
	private sourceDAO!: SourceDAO;

	async execute(input: FindSourceByIdInput): Promise<FindSourceByIdOutput> {
		const { sourceId } = input;

		const source = await this.sourceDAO.findById(sourceId);

		return source;
	}
}
