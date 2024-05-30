import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { SearchArtistByNameDtoSchema } from "./models/dto/search-artist.schema.dto";
import { ArtistService } from "./services/artist.service";


dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", async (req: Request, res: Response) => {
	const queryParams = SearchArtistByNameDtoSchema.parse(req.query);
	const artistService = new ArtistService();
	const result = await artistService.findArtistByName(queryParams);
	res.send("Testing the server is working");
});


app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
