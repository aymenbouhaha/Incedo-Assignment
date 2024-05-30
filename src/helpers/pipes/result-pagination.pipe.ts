import { API_LIMIT } from "../../constant/external-api.constants";

export class ResultPaginationPipe {
	static paginateResult(data: any[], page: number, total: number) {
		const nextPageExist = Math.ceil(total / API_LIMIT) > page;
		return {
			totalCount: total,
			previousPageNumber: page !== 1 ? page - 1 : null,
			nextPageNumber: nextPageExist ? page + 1 : null,
			currentCount: data.length,
			result: data,
		};
	}
}
