import { Artist } from "../models/dto/api-result.schemas.dto";
import { createObjectCsvWriter } from "csv-writer";
import fs from "fs";
import csvParser from "csv-parser";
import { CustomException } from "../models/exceptions/custom.exception";
import {
	CSV_IMAGE_COLUMN_NAME,
	CSV_MBID_COLUMN_NAME,
	CSV_NAME_COLUMN_NAME,
	CSV_SMALL_IMAGE_COLUMN_NAME,
	CSV_URL_COLUMN_NAME,
} from "../constant/common";

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
				{ id: "name", title: CSV_NAME_COLUMN_NAME },
				{ id: "mbid", title: CSV_MBID_COLUMN_NAME },
				{ id: "url", title: CSV_URL_COLUMN_NAME },
				{ id: "image", title: CSV_IMAGE_COLUMN_NAME },
				{ id: "smallImage", title: CSV_SMALL_IMAGE_COLUMN_NAME },
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
							name: row[CSV_NAME_COLUMN_NAME],
							url: row[CSV_URL_COLUMN_NAME],
							mbid: row[CSV_MBID_COLUMN_NAME],
							smallImage: row[CSV_SMALL_IMAGE_COLUMN_NAME],
							image: row[CSV_IMAGE_COLUMN_NAME],
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
