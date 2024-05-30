import { z } from "zod";

export const ApiArtistSchema = z
	.object({
		name: z.string(),
		url: z.string().url("The provided format is invalid"),
		mbid: z.string(),
		image: z.array(
			z.object({
				"#text": z.string(),
				size: z.string(),
			}),
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
			smallImage: finalImages.get("small"),
			image: finalImages.get("mega"),
		};
	});

export type Artist = z.infer<typeof ApiArtistSchema>;

export const ApiResultSchema = z
	.object({
		results: z.object({
			"opensearch:totalResults": z.string().transform((val) => Number(val)),
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

export type ApiResult = z.infer<typeof ApiResultSchema>;

export const ExternalApiErrorSchema = z.object({
	message: z.string(),
	error: z.number(),
});

export type ExternalApiError = z.infer<typeof ExternalApiErrorSchema>;
