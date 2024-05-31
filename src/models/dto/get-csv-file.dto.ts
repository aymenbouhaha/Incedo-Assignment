import { z } from "zod";

export const CsvFileNameSchema = z
	.string({
		required_error: "Please enter a file name where to store the csv file",
	})
	.regex(/^[^.]*$/, {
		message: 'The file name must not contain "."',
	});

export const GetCsvFileSchemaDto = z
	.object({
		csv_file_name: CsvFileNameSchema,
	})
	.transform((value) => {
		return {
			csvFileName: value.csv_file_name,
		};
	});

export type GetCsvFileDto = z.infer<typeof GetCsvFileSchemaDto>;
