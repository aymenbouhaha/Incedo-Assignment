import { Request, Response } from "express";
import { SearchArtistByNameDtoSchema } from "../models/dto/search-artist.schema.dto";
import artistService from "../services/artist.service";
import { ZodError } from "zod";
import { CustomException } from "../models/exceptions/custom.exception";
import { zodErrorFormatter } from "../helpers/formatter/zod-error.formatter";
import { GetCsvFileSchemaDto } from "../models/dto/get-csv-file.dto";

export class ArtistController {
	async findArtistByName(request: Request, response: Response) {
		try {
			const queryParams = SearchArtistByNameDtoSchema.parse(request.query);
			const result = await artistService.findArtistsByName(queryParams);
			response.send(result);
		} catch (error) {
			console.error(error);
			if (error instanceof ZodError) {
				const errorFormatted = zodErrorFormatter(error.errors);
				return response
					.status(400)
					.send(new CustomException(errorFormatted, 400).toJson());
			}
			if (error instanceof CustomException) {
				return response.status(error.code).send(error.toJson());
			}
			return response
				.status(500)
				.send(
					new CustomException(
						"An error occurred, please retry later",
						500,
					).toJson(),
				);
		}
	}

	getArtistsCsvFile(request: Request, response: Response) {
		try {
			const queryParams = GetCsvFileSchemaDto.parse(request.query);
			artistService.getArtistsCsvFile(response, queryParams);
		} catch (error) {
			console.error(error);
			if (error instanceof ZodError) {
				const errorFormatted = zodErrorFormatter(error.errors);
				return response
					.status(400)
					.send(new CustomException(errorFormatted, 400).toJson());
			}
			return response
				.status(500)
				.send(
					new CustomException(
						"An error occurred, please retry later",
						500,
					).toJson(),
				);
		}
	}
}

export default new ArtistController();
