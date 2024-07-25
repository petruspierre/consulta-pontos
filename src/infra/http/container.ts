import { Container } from "inversify";
import { SourceController } from "./source-controller.js";

export const CONTROLLERS = {
	SOURCE: Symbol("SourceController"),
};

const controllersContainer = new Container({ defaultScope: "Transient" });

controllersContainer.bind(CONTROLLERS.SOURCE).to(SourceController);

export { controllersContainer };
