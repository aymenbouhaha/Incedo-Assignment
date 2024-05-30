import { AxiosError } from "axios";
import { ExternalApiErrorSchema } from "../../models/dto/api-result.schemas.dto";
import { CustomException } from "../../models/exceptions/custom.exception";

export const apiErrorFormatter = (error: AxiosError) => {
	if (error.response && error.response.data) {
		try {
			const externalApiError = ExternalApiErrorSchema.parse(
				error.response.data,
			);
			return new CustomException(externalApiError.message, 502);
		} catch (e) {
			return new CustomException("An Error Occurred, please retry later", 500);
		}
	}
};
