import { SearchArtistDto } from "../models/dto/search-artist.schema.dto";
import { axios } from "../config/axios.config";
import { ApiResultSchema } from "../models/dto/api-result.schemas.dto";
import { ArtistCsvService } from "./csv.service";
import { Response } from "express";
import path from "node:path";
import fs from "fs";
import dummyArtist from "../assets/dummy-artists.json";
import { ResultPaginationPipe } from "../helpers/pipes/result-pagination.pipe";
import { API_LIMIT } from "../constant/external-api.constants";

export class ArtistService {


	async findArtistByName(searchParams: SearchArtistDto) {
		try {
			const searchResult = await axios.get("", {
				params: {
					limit: API_LIMIT,
					method: "artist.search",
					artist: searchParams.artistName,
					page: searchParams.page,
				},
			});
			const { artists, totalResults } = ApiResultSchema.parse(searchResult.data);
			if (artists.length) {
				const artistCsvService = ArtistCsvService.getInstance();
				await artistCsvService.writeToArtistsCsvFile(
					artists,
					"artist.csv",
				);
				return {
					dummyArtist: false,
					...ResultPaginationPipe.paginateResult(artists, searchParams.page ?? 1, totalResults),
				};
			}
			return {
				dummyArtist: true,
				...ResultPaginationPipe.paginateResult(dummyArtist, 1, dummyArtist.length),
			};
		} catch (e) {
			console.log(e);
		}
	}


	getArtistsCsvFile(response: Response) {
		const filePath = path.join(process.cwd(), "artist.csv");
		fs.access(filePath, fs.constants.F_OK, (err) => {
			if (err) {
				return response.status(404).send("File not found");
			}
			response.setHeader("Content-Type", "text/csv");
			response.setHeader("Content-Disposition", "attachment; filename=artist.csv");
			const fileStream = fs.createReadStream(filePath);
			fileStream.pipe(response);
		});
	}

}

export default new ArtistService();