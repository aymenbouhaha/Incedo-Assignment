export class ResultPaginationPipe {
	static paginateResult(
		data: any[],
		page: number,
		total: number,
		limit: number,
	) {
		const nextPageExist = Math.ceil(total / limit) > page;
		return {
			totalCount: total,
			previousPageNumber: page !== 1 ? page - 1 : null,
			nextPageNumber: nextPageExist ? page + 1 : null,
			currentCount: data.length,
			result: data,
		};
	}
}
