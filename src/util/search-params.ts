export type SearchQueryParams = {
	page?: string;
	perPage?: string;
	filter?: string;
	sort?: string;
	sortDir?: string;
};

export type PaginatedOutput<T> = {
	data: T;
	meta: {
		page: number;
		perPage: number;
	};
};

export type SortDir = "asc" | "desc";

export type SearchParamsProps<Filter = string> = {
	page?: number | string;
	perPage?: number | string;
	sort?: string | null;
	sortDir?: string | null;
	filter?: Filter | null;
};

export class SearchParams<Filter = string> {
	protected _page!: number;
	protected _perPage!: number;
	protected _sort!: string | null;
	protected _sortDir!: SortDir | null;
	protected _filter!: Filter | null;

	constructor(props: SearchParamsProps<Filter> = {}) {
		this.page = props.page || 1;
		this.perPage = props.perPage || 10;
		this.sort = props.sort || null;
		this.sortDir = props.sortDir || null;
		this.filter = props.filter || null;
	}

	get page(): number {
		return this._page;
	}

	private set page(value: number | string) {
		let _page = +value;

		if (
			Number.isNaN(_page) ||
			_page <= 0 ||
			Number.parseInt(value as string) !== _page
		) {
			_page = 1;
		}

		this._page = _page;
	}

	get perPage(): number {
		return this._perPage;
	}

	private set perPage(value: number | string) {
		let _perPage = +value;

		if (
			Number.isNaN(_perPage) ||
			_perPage <= 0 ||
			Number.parseInt(value as string) !== _perPage
		) {
			_perPage = 10;
		}

		this._perPage = _perPage;
	}

	get sort(): string | null {
		return this._sort;
	}

	private set sort(value: string | null) {
		this._sort =
			value === null || value === undefined || value === "" ? null : `${value}`;
	}

	get sortDir(): SortDir | null {
		return this._sortDir;
	}

	private set sortDir(value: string | null) {
		if (!this.sort) {
			this._sortDir = null;
			return;
		}

		const dir = `${value}`.toLowerCase();
		this._sortDir = dir !== "asc" && dir !== "desc" ? "asc" : dir;
	}

	get filter(): Filter | null {
		return this._filter;
	}

	protected set filter(value: Filter | null) {
		if (value === null || value === undefined || (value as unknown) === "") {
			this._filter = null;
			return;
		}
		this._filter = value;
	}
}
