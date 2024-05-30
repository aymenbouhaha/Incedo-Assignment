import { Artist } from "../models/dto/api-result.schemas.dto";
import { createObjectCsvWriter } from "csv-writer";
import fs from "fs";
import csvParser from "csv-parser";
import { CustomException } from "../models/exceptions/custom.exception";

export class ArtistCsvService {
	private constructor() {}

	private static instance: ArtistCsvService;

	public static getInstance() {
		if (ArtistCsvService.instance) {
			return ArtistCsvService.instance;
		}
		ArtistCsvService.instance = new ArtistCsvService();
		return ArtistCsvService.instance;
	}

	async writeToArtistsCsvFile(artists: Artist[], filePath: string) {
		const newArtists = await this.findNewArtists(artists, filePath);
		if (newArtists.length === 0) {
			console.log("There is no new records to add");
			return;
		}
		const fileExists = fs.existsSync(filePath);
		const csvWriter = createObjectCsvWriter({
			path: filePath,
			header: [
				{ id: "name", title: "Name" },
				{ id: "mbid", title: "MBID" },
				{ id: "url", title: "URL" },
				{ id: "image", title: "Image" },
				{ id: "smallImage", title: "Small Image" },
			],
			append: fileExists,
		});
		try {
			await csvWriter.writeRecords(newArtists);
			console.log("The Csv file was updated successfully.");
		} catch (error) {
			throw new CustomException(
				"An error occurred when updating the csv file",
				500,
			);
		}
	}

	readFromCsvFile(filePath: string): Promise<Artist[]> {
		return new Promise((resolve, reject) => {
			const existingRecords: Artist[] = [];
			if (fs.existsSync(filePath)) {
				fs.createReadStream(filePath)
					.pipe(csvParser())
					.on("data", (row: any) => {
						existingRecords.push({
							name: row.Name,
							url: row.URL,
							mbid: row.MBID,
							smallImage: row["Small Image"],
							image: row.Image,
						});
					})
					.on("end", () => {
						resolve(existingRecords);
					})
					.on("error", (error: any) => {
						reject(error);
					});
			} else {
				resolve(existingRecords);
			}
		});
	}

	private async findNewArtists(
		artists: Artist[],
		filePath: string,
	): Promise<Artist[]> {
		const existingArtists = await this.readFromCsvFile(filePath);
		return artists.filter(
			(artist) =>
				!existingArtists.some(
					(existing) =>
						existing.name === artist.name &&
						existing.mbid === artist.mbid &&
						existing.image === artist.image &&
						existing.smallImage === artist.smallImage,
				),
		);
	}
}
