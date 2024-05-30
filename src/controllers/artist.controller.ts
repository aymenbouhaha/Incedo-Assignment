import { Request, Response } from "express";
import { SearchArtistByNameDtoSchema } from "../models/dto/search-artist.schema.dto";
import artistService from "../services/artist.service";


export class ArtistController {


	async findArtistByName(request: Request, response: Response) {
		const queryParams = SearchArtistByNameDtoSchema.parse(request.query);
		const result = await artistService.findArtistByName(queryParams);
		response.send(result);
	}

	getArtistsCsvFile(request: Request, response: Response) {
		artistService.getArtistsCsvFile(response);
	}


}

export default new ArtistController();