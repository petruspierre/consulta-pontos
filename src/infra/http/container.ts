import { Container } from "inversify";
import { SourceController } from "./source-controller.js";
import { PartnerController } from "./partner-controller.js";

export const CONTROLLERS = {
	SOURCE: Symbol("SourceController"),
	PARTNER: Symbol("PartnerController"),
};

const controllersContainer = new Container({ defaultScope: "Transient" });

controllersContainer.bind(CONTROLLERS.SOURCE).to(SourceController);
controllersContainer.bind(CONTROLLERS.PARTNER).to(PartnerController);

export { controllersContainer };
