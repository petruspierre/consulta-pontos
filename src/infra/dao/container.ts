import { Container } from "inversify";
import { SourceDAO } from "./source.dao.js";
import { ParityDAO } from "./parity.dao.js";
import { PartnerDAO } from "./partner.dao.js";

export const DAOS = {
	SOURCE: Symbol("SourceDAO"),
	PARTNER: Symbol("PartnerDAO"),
	PARITY: Symbol("ParityDAO"),
};

const daoContainer = new Container({ defaultScope: "Transient" });

daoContainer.bind(DAOS.SOURCE).to(SourceDAO);
daoContainer.bind(DAOS.PARITY).to(ParityDAO);
daoContainer.bind(DAOS.PARTNER).to(PartnerDAO);

export { daoContainer };
