import axios from 'axios';

const axiosInstance = axios.create({});

axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
		}

		console.log(error);

		return Promise.reject(error);
	}
);

axiosInstance.interceptors.request.use(
	async (request) => {
		return request;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default axiosInstance;
