import { Router } from "express";
import artistController from "../controllers/artist.controller";


export class ArtistRoute {

	router = Router();

	constructor() {
		this.initializeRoute();
	}


	initializeRoute() {
		this.router.get("/", artistController.findArtistByName);
		this.router.get("/csv", artistController.getArtistsCsvFile);
	}

}

export default new ArtistRoute().router;