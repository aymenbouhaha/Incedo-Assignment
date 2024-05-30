import Axios from "axios";
import dotenv from "dotenv";
import { RESULT_FORMAT } from "../constant/external-api.constants";

dotenv.config();

export const axios = Axios.create({
	baseURL: process.env.API_URL,
});

axios.interceptors.request.use((config) => {
	const params = config.params;
	config.params = {
		...params,
		api_key: process.env.API_KEY,
		format: RESULT_FORMAT,
	};
	return config;
});
