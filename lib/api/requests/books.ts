import axiosInstance from '..';
import { BookInfoRequest, ZLibrarySearchBooksRequest } from '../types';

const GOODREADS_BASE_URL = process.env.EXPO_PUBLIC_GOODREADS_BASE_URL;
const Z_LIBRARY_BASE_URL = process.env.EXPO_PUBLIC_Z_LIBRARY_DEFAULT_BASE_URL;

export const getMostPopularBooks = async () => {
	const { data } = await axiosInstance.get(
		`${Z_LIBRARY_BASE_URL}/eapi/book/most-popular`
	);
	return data;
};

export const searchForBook = async (payload: ZLibrarySearchBooksRequest) => {
	const { data } = await axiosInstance.post(
		`${Z_LIBRARY_BASE_URL}/eapi/book/search`,
		payload,
		{
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		}
	);

	return data;
};

export const searchForGoodreadsBook = async (payload: BookInfoRequest) => {
	let title = payload.title;
	if (payload.otherInfo) {
		title += ' ' + payload.otherInfo.join(' ');
	}

	const { data } = await axiosInstance.get(`${GOODREADS_BASE_URL}/search`, {
		params: {
			q: title,
		},
	});

	return data;
};

export const getGoodreadsBookInfo = async (titleUrl: string) => {
	const { data } = await axiosInstance.get(`${GOODREADS_BASE_URL}/${titleUrl}`);
	return data;
};

export const getZLibraryBookInfo = async (payload: BookInfoRequest) => {
	let title = payload.title;
	if (payload.otherInfo) {
		title += ' ' + payload.otherInfo.join(' ');
	}

	const { data } = await axiosInstance.post(
		`${Z_LIBRARY_BASE_URL}/eapi/book/search`,
		{ message: title },
		{
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		}
	);

	return data;
};
