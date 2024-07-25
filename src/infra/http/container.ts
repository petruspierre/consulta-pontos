import { Container } from "inversify";
import { SourceController } from "./source-controller.js";
import { PartnerController } from "./partner-controller.js";
import { ParityController } from "./parity-controller.js";

export const CONTROLLERS = {
	SOURCE: Symbol("SourceController"),
	PARTNER: Symbol("PartnerController"),
	PARITY: Symbol("ParityController"),
};

const controllersContainer = new Container({ defaultScope: "Transient" });

controllersContainer.bind(CONTROLLERS.SOURCE).to(SourceController);
controllersContainer.bind(CONTROLLERS.PARTNER).to(PartnerController);
controllersContainer.bind(CONTROLLERS.PARITY).to(ParityController);

export { controllersContainer };
