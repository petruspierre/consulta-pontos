export type SearchQueryParams = {
	page?: string;
	per_page?: string;
	filter?: string;
	sort?: string;
	sort_dir?: string;
};

export type SortDir = "asc" | "desc";

export type SearchParamsProps<Filter = string> = {
	page?: number | string;
	per_page?: number | string;
	sort?: string | null;
	sort_dir?: string | null;
	filter?: Filter | null;
};

export class SearchParams<Filter = string> {
	protected _page!: number;
	protected _per_page!: number;
	protected _sort!: string | null;
	protected _sort_dir!: SortDir | null;
	protected _filter!: Filter | null;

	constructor(props: SearchParamsProps<Filter> = {}) {
		this.page = props.page || 1;
		this.per_page = props.per_page || 10;
		this.sort = props.sort || null;
		this.sort_dir = props.sort_dir || null;
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

	get per_page(): number {
		return this._per_page;
	}

	private set per_page(value: number | string) {
		let _per_page = +value;

		if (
			Number.isNaN(_per_page) ||
			_per_page <= 0 ||
			Number.parseInt(value as string) !== _per_page
		) {
			_per_page = 10;
		}

		this._per_page = _per_page;
	}

	get sort(): string | null {
		return this._sort;
	}

	private set sort(value: string | null) {
		this._sort =
			value === null || value === undefined || value === "" ? null : `${value}`;
	}

	get sort_dir(): SortDir | null {
		return this._sort_dir;
	}

	private set sort_dir(value: string | null) {
		if (!this.sort) {
			this._sort_dir = null;
			return;
		}

		const dir = `${value}`.toLowerCase();
		this._sort_dir = dir !== "asc" && dir !== "desc" ? "asc" : dir;
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
