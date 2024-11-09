import * as cheerio from 'cheerio';
import { GoodreadsBook, ZLibraryBook } from '@/types/books';
import { BookInfoRequest } from '../api/types';
import {
	getGoodreadsBookInfo,
	searchForGoodreadsBook,
} from '../api/requests/books';

export const fetchBookInfo = async (payload: BookInfoRequest) => {
	const goodreadsBookInfo = await searchForGoodreadsBook(payload);
	let $ = cheerio.load(goodreadsBookInfo);
	let resultsTable = $('.tableList');
};
