import { z } from "zod";
import { NUMBER_REGEX } from "../../constant/common";

export const ApiArtistSchema = z
	.object({
		name: z.string({
			required_error: "The name is required",
		}),
		url: z
			.string({
				required_error: "The url is required",
			})
			.url("The provided format is invalid"),
		mbid: z.string({
			required_error: "The mbid is required",
		}),
		image: z.array(
			z.object({
				"#text": z.string(),
				size: z.string(),
			}),
			{
				required_error: "The images are required",
			},
		),
	})
	.transform((artist) => {
		const finalImages: Map<string, string> = new Map();
		const images = artist.image;
		for (const image of images) {
			if (image.size === "small" || image.size === "mega") {
				finalImages.set(image.size, image["#text"]);
			}
		}
		return {
			name: artist.name,
			url: artist.url,
			mbid: artist.mbid,
			smallImage: finalImages.get("small") ?? "",
			image: finalImages.get("mega") ?? "",
		};
	});

export type Artist = z.infer<typeof ApiArtistSchema>;

export const ApiResultSchema = z
	.object({
		results: z.object({
			"opensearch:totalResults": z
				.string()
				.regex(NUMBER_REGEX, { message: "The total results must be a number" })
				.transform((val) => Number(val)),
			artistmatches: z.object({
				artist: z.array(ApiArtistSchema),
			}),
		}),
	})
	.transform((result) => {
		return {
			totalResults: result.results["opensearch:totalResults"],
			artists: result.results.artistmatches.artist,
		};
	});

export const ExternalApiErrorSchema = z.object({
	message: z.string({
		required_error: "The error message is required",
	}),
	error: z.number({
		required_error: "The error code is required",
	}),
});
