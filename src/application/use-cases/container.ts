import { Container } from "inversify";
import { SearchSourcesUseCase } from "./search-sources.js";
import { FindSourceByIdUseCase } from "./find-source-by-id.js";

export const USE_CASES = {
	SEARCH_SOURCES: Symbol("SearchSourcesUseCase"),
	FIND_SOURCE_BY_ID: Symbol("FindSourceByIdUseCase"),
};

const useCasesContainer = new Container({ defaultScope: "Transient" });

useCasesContainer
	.bind<SearchSourcesUseCase>(USE_CASES.SEARCH_SOURCES)
	.to(SearchSourcesUseCase);

useCasesContainer
	.bind<FindSourceByIdUseCase>(USE_CASES.FIND_SOURCE_BY_ID)
	.to(FindSourceByIdUseCase);

export { useCasesContainer };
