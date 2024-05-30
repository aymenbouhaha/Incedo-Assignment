import express, { Application } from "express";
import bodyParser from "body-parser";
import ArtistRoute from "./routes/artist.route";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "node:path";

dotenv.config();

class Server {
	public app: Application;

	constructor() {
		this.app = express();
		this.config();
		this.routes();
		this.documentation();
	}

	private config(): void {
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: false }));
	}

	private routes(): void {
		this.app.use("/artists", ArtistRoute);
	}

	private documentation(): void {
		const filePath = path.join(process.cwd(), "documentation/swagger.yaml");
		const swaggerDocument = YAML.load(filePath);
		this.app.use(
			"/api-docs",
			swaggerUi.serve,
			swaggerUi.setup(swaggerDocument),
		);
	}

	public start(): void {
		const port = process.env.PORT || 3000;
		this.app.listen(port, () => {
			console.log(`Server is running on http://localhost:${port}`);
		});
	}
}

const server = new Server();
server.start();
