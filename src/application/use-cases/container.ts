import { Container } from "inversify";
import { SearchSourcesUseCase } from "./search-sources.js";

export const USE_CASES = {
	SEARCH_SOURCES: Symbol("SearchSourcesUseCase"),
};

const useCasesContainer = new Container({ defaultScope: "Transient" });

useCasesContainer
	.bind<SearchSourcesUseCase>(USE_CASES.SEARCH_SOURCES)
	.to(SearchSourcesUseCase);

export { useCasesContainer };
