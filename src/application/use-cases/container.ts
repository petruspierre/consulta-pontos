import { Container } from "inversify";
import { SearchSourcesUseCase } from "./search-sources.js";
import { FindSourceByIdUseCase } from "./find-source-by-id.js";
import { SearchPartnersUseCase } from "./search-partners.js";
import { FindPartnerByIdUseCase } from "./find-partner-by-id.js";

export const USE_CASES = {
	SEARCH_SOURCES: Symbol("SearchSourcesUseCase"),
	FIND_SOURCE_BY_ID: Symbol("FindSourceByIdUseCase"),
	SEARCH_PARTNERS: Symbol("SearchPartnersUseCase"),
	FIND_PARTNER_BY_ID: Symbol("FindPartnerByIdUseCase"),
};

const useCasesContainer = new Container({ defaultScope: "Transient" });

useCasesContainer
	.bind<SearchSourcesUseCase>(USE_CASES.SEARCH_SOURCES)
	.to(SearchSourcesUseCase);

useCasesContainer
	.bind<FindSourceByIdUseCase>(USE_CASES.FIND_SOURCE_BY_ID)
	.to(FindSourceByIdUseCase);

useCasesContainer
	.bind<SearchPartnersUseCase>(USE_CASES.SEARCH_PARTNERS)
	.to(SearchPartnersUseCase);

useCasesContainer
	.bind<FindPartnerByIdUseCase>(USE_CASES.FIND_PARTNER_BY_ID)
	.to(FindPartnerByIdUseCase);

export { useCasesContainer };
