import { z } from "zod";

const numberRegex = /^-?\d+(\.\d+)?$/;

export const SearchArtistByNameDtoSchema = z.object({
	page: z
		.string()
		.regex(numberRegex, { message: "The page must be a number" })
		.transform((val) => Number(val))
		.optional(),
	artist_name: z.string({
		required_error: "You must enter the name you're searching for",
	}),
});

export type SearchArtistDto = z.infer<typeof SearchArtistByNameDtoSchema>;