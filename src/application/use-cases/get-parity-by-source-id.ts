import { DAOS } from "@/infra/dao/container.js";
import type { ParityDAO } from "@/infra/dao/parity.dao.js";
import { inject, injectable } from "inversify";

export type GetParityBySourceIdInput = {
	sourceId: number;
};

export type GetParityBySourceIdOutput = {
	sourceName: string;
	sourceId: number;
	partnerName: string;
	partnerId: number;
	parityId: string;
	partnerSourceId: string;
	currency: string;
	value: number;
	parity: number;
	premiumParity: number | null;
	createdAt: Date;
};

@injectable()
export class GetParityBySourceIdUseCase {
	@inject(DAOS.PARITY)
	private parityDAO!: ParityDAO;

	async execute(
		input: GetParityBySourceIdInput,
	): Promise<GetParityBySourceIdOutput[]> {
		return this.parityDAO.getBySourceId(input.sourceId);
	}
}
