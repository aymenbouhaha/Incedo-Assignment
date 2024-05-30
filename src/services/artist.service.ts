import { SearchArtistDto } from "../models/dto/search-artist.schema.dto";
import { axios } from "../config/axios.config";
import { ApiResultSchema, Artist } from "../models/dto/api-result.schemas";
import { ArtistCsvService } from "./csv.service";
import { Response } from "express";
import path from "node:path";
import fs from "fs";


export class ArtistService {


	async findArtistByName(searchParams: SearchArtistDto) {
		try {
			const searchResult = await axios.get("", {
				params: {
					method: "artist.search",
					artist: searchParams.artist_name,
					page: searchParams.page,
				},
			});
			const parsedResult = ApiResultSchema.parse(searchResult.data);
			if (parsedResult.length) {
				const artistCsvService = ArtistCsvService.getInstance();
				await artistCsvService.writeToArtistsCsvFile(
					parsedResult,
					"artist.csv",
				);
				return parsedResult;
			}
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
