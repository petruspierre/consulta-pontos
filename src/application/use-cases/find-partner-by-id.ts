import { inject, injectable } from "inversify";

import type { PartnerDAO } from "@/infra/dao/partner.dao.js";
import { DAOS } from "@/infra/dao/container.js";

export type FindPartnerByIdInput = {
	partnerId: number;
};

export type FindPartnerByIdOutput = {
	id: number;
	name: string;
	sources: {
		id: string;
		sourceId: number;
		sourceName: string;
		sourceUrl: string;
	}[];
};

@injectable()
export class FindPartnerByIdUseCase {
	@inject(DAOS.PARTNER)
	private partnerDAO!: PartnerDAO;

	async execute(input: FindPartnerByIdInput): Promise<FindPartnerByIdOutput> {
		const { partnerId } = input;

		const partner = await this.partnerDAO.findById(partnerId);

		return partner;
	}
}
