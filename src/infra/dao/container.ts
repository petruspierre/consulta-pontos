import { Container } from "inversify";
import { SourceDAO } from "./source.dao.js";
import { ParityDAO } from "./parity.dao.js";

export const DAOS = {
	SOURCE: Symbol("SourceDAO"),
	PARTNER: Symbol("PartnerDAO"),
	PARITY: Symbol("ParityDAO"),
};

const daoContainer = new Container({ defaultScope: "Transient" });

daoContainer.bind(DAOS.SOURCE).to(SourceDAO);
daoContainer.bind(DAOS.PARITY).to(ParityDAO);

export { daoContainer };
