import { Container } from "inversify";
import { useCasesContainer } from "./application/use-cases/container.js";
import { controllersContainer } from "./infra/http/container.js";
import { daoContainer } from "./infra/dao/container.js";

const appContainer = Container.merge(
	useCasesContainer,
	daoContainer,
	controllersContainer,
);

export { appContainer };
