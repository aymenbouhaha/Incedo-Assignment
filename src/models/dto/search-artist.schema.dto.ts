import { z } from "zod";
import { CsvFileNameSchema } from "./get-csv-file.dto";
import { NUMBER_REGEX } from "../../constant/common";

export const SearchArtistByNameDtoSchema = z
	.object({
		csv_file_name: CsvFileNameSchema,
		page: z
			.string()
			.regex(NUMBER_REGEX, { message: "The page must be a number" })
			.transform((val) => Number(val))
			.optional(),
		artist_name: z
			.string({
				required_error: "Please enter the name you're searching for",
			})
			.min(1, {
				message: "The artist name must contain at least 1 characters",
			}),
	})
	.transform((value) => {
		return {
			page: value.page,
			artistName: value.artist_name,
			csvFileName: value.csv_file_name,
		};
	});

export type SearchArtistDto = z.infer<typeof SearchArtistByNameDtoSchema>;
