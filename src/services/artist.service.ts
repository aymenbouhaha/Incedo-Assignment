import { SearchArtistDto } from "../models/dto/search-artist.schema.dto";
import { axios } from "../config/axios.config";
import { ApiResultSchema } from "../models/dto/api-result.schemas.dto";
import { ArtistCsvService } from "./csv.service";
import { Response } from "express";
import path from "node:path";
import fs from "fs";
import dummyArtist from "../assets/dummy-artists.json";
import { ResultPaginationPipe } from "../helpers/pipes/result-pagination.pipe";
import {
	API_LIMIT,
	SEARCH_ARTIST_METHOD,
} from "../constant/external-api.constants";
import { AxiosError } from "axios";
import { apiErrorFormatter } from "../helpers/formatter/api-error.formatter";
import { CustomException } from "../models/exceptions/custom.exception";
import { ZodError } from "zod";
import { ARTISTS_CSV_OUTPUT_FOLDER } from "../constant/common";
import { GetCsvFileDto } from "../models/dto/get-csv-file.dto";

export class ArtistService {
	async findArtistByName(searchParams: SearchArtistDto) {
		try {
			const { artistName, page, csvFileName } = searchParams;
			const searchResult = await axios.get("", {
				params: {
					limit: API_LIMIT,
					method: SEARCH_ARTIST_METHOD,
					artist: artistName,
					page: page,
				},
			});
			const { artists, totalResults } = ApiResultSchema.parse(
				searchResult.data,
			);
			if (artists.length) {
				const artistCsvService = ArtistCsvService.getInstance();
				const filePath = path.join(
					process.cwd(),
					`${ARTISTS_CSV_OUTPUT_FOLDER}${csvFileName}.csv`,
				);
				await artistCsvService.writeToArtistsCsvFile(artists, filePath);
				return {
					dummyArtist: false,
					...ResultPaginationPipe.paginateResult(
						artists,
						searchParams.page ?? 1,
						totalResults,
						API_LIMIT,
					),
				};
			}
			return {
				dummyArtist: true,
				...ResultPaginationPipe.paginateResult(
					dummyArtist,
					1,
					dummyArtist.length,
					dummyArtist.length,
				),
			};
		} catch (e: any) {
			if (e instanceof AxiosError) {
				throw apiErrorFormatter(e);
			}
			if (e instanceof ZodError) {
				throw new CustomException("An error occurred, please retry later", 500);
			}
			throw e;
		}
	}

	getArtistsCsvFile(response: Response, getCsvDto: GetCsvFileDto) {
		const { csvFileName } = getCsvDto;
		const filePath = path.join(
			process.cwd(),
			`${ARTISTS_CSV_OUTPUT_FOLDER}${csvFileName}.csv`,
		);
		fs.access(filePath, fs.constants.F_OK, (err) => {
			if (err) {
				return response
					.status(404)
					.send(new CustomException("File not found", 404).toJson());
			}
			response.setHeader("Content-Type", "text/csv");
			response.setHeader(
				"Content-Disposition",
				"attachment; filename=artist.csv",
			);
			const fileStream = fs.createReadStream(filePath);
			fileStream.pipe(response);
		});
	}
}

export default new ArtistService();
