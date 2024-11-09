import axios from 'axios';
import * as cheerio from 'cheerio';
import { GoodreadsBook, ZLibraryBook } from '@/types/books';
import { BookProviderService } from '@/types/services';
import { BookInfoRequest } from '@/lib/api/types';
import {
	getGoodreadsBookInfo,
	getZLibraryBookInfo,
	searchForGoodreadsBook,
} from '@/lib/api/requests/books';

const GOODREADS_BASE_URL = process.env.EXPO_PUBLIC_GOODREADS_BASE_URL;
const Z_LIBRARY_BASE_URL = process.env.EXPO_PUBLIC_Z_LIBRARY_DEFAULT_BASE_URL;

export class GoodreadsService implements BookProviderService {
	async fetchBookInfo(payload: BookInfoRequest): Promise<GoodreadsBook> {
		const goodreadsBookInfo = await searchForGoodreadsBook(payload);
		let $ = cheerio.load(goodreadsBookInfo);
		let resultsTable = $('.tableList');

		//  if the table is not found, try again with z-library API
		if (resultsTable.html() === null) {
			const zLibraryBookInfo = await getZLibraryBookInfo(payload);

			let bookResult: ZLibraryBook = zLibraryBookInfo.books.find(
				(book: ZLibraryBook) => book.description !== ''
			);

			if (!bookResult) {
				bookResult = zLibraryBookInfo.books[0];
			}

			bookResult.description = bookResult.description
				?.replace(/<br>/g, '\n')
				.replace(/<.*?>/g, '');

			if (bookResult.href) {
				bookResult.href = `${Z_LIBRARY_BASE_URL}${bookResult.href}`;
			}

			const book: GoodreadsBook = {
				url: bookResult.href,
				title: bookResult.title,
				series: bookResult.series,
				author: bookResult.author,
				cover: bookResult.cover,
				rating: parseFloat(bookResult.interestScore),
				ratingsCount: 0,
				reviewsCount: 0,
				description: bookResult.description,
				genres: [],
				numberOfPages: bookResult.pages,
				type: '',
				firstPublishDate: bookResult.year,
				reviews: [],
			};

			return book;
		}

		const firstResult = resultsTable.find('tbody tr').first();

		const titleUrl = $(firstResult).find('.bookTitle').attr('href')!;
		const author = $(firstResult)
			.find('[itemprop="author"] .authorName__container')
			.map((index, element) => {
				const $element = $(element);
				const authorName = $element.find('span[itemprop="name"]').text();
				const authorRole = $element.find('.role').text();
				return `${authorName}${authorRole ? ' ' + authorRole : ''}`;
			})
			.get()
			.join(', ');

		const rating = parseFloat(
			$(firstResult)
				.find('.minirating')
				.text()
				.match(/([\d.]+) avg rating/)![1]
		);

		const completeBookData = await getGoodreadsBookInfo(titleUrl);
		const $bookResult = cheerio.load(completeBookData);

		const bookTitle = $bookResult('.BookPageTitleSection__title h1').text();

		const bookSeries = $bookResult('.BookPageTitleSection__title h3').text();

		// Extract rating and reviews
		const ratingsCountText = $bookResult('[data-testid="ratingsCount"]')
			.text()
			.trim()
			.split(/\s+/)[0]
			.replace(',', '');
		const ratingsCount = parseInt(ratingsCountText, 10);
		const reviewsCountText = $bookResult('[data-testid="reviewsCount"]')
			.text()
			.trim()
			.split(/\s+/)[0]
			.replace(',', '');
		const reviewsCount = parseInt(reviewsCountText, 10);

		const cover = $bookResult('.BookCover__image img.ResponsiveImage').attr(
			'src'
		)!;

		// Extract book description
		const bookDescription = $bookResult(
			'.DetailsLayoutRightParagraph__widthConstrained'
		)
			.html()!
			.replace(/<br>/g, '\n')
			.replace(/<.*?>/g, '');

		// Extract list of genres
		const genres = $bookResult('.BookPageMetadataSection__genres a')
			.map((_, element) => $bookResult(element).text())
			.get();

		// Extract number of pages
		const pageFormatSplit = $bookResult('[data-testid="pagesFormat"]')
			.text()
			.trim()
			.split(/\s+/);

		const numberOfPages = pageFormatSplit[0];

		// Extract book type
		const bookType = pageFormatSplit[2];

		// Extract first publish date
		const firstPublishDate = $bookResult('[data-testid="publicationInfo"]')
			.text()
			.trim()
			.split(/\s+/)
			.slice(2)
			.join(' ');

		const bookUrl = `${GOODREADS_BASE_URL}${titleUrl}`;

		const book: GoodreadsBook = {
			url: bookUrl,
			series: bookSeries,
			title: bookTitle,
			author,
			cover,
			rating,
			ratingsCount,
			reviewsCount,
			description: bookDescription,
			genres,
			numberOfPages,
			type: bookType,
			firstPublishDate,
			reviews: [],
		};

		$bookResult('.ReviewsList')
			.find('.ReviewCard')
			.slice(0, 10)
			.each((_, element) => {
				const $review = $bookResult(element);
				const userAvatar = $review
					.find('.ReviewerProfile__avatar')
					.find('img')
					.attr('src')!;
				const userName = $review.find('.ReviewerProfile__name').text();

				const reviewRatingText = $review
					.find('.ShelfStatus span')
					.attr('aria-label');

				const reviewRating = parseInt(
					reviewRatingText?.split(' ')[1] || '0',
					10
				);

				const reviewText = $review
					.find('.ReviewText__content')
					.html()!
					.replace(/<br>/g, '\n')
					.replace(/<.*?>/g, '');
				const review = {
					userAvatar,
					userName,
					rating: reviewRating,
					reviewText,
				};

				book.reviews.push(review);
			});

		return book;
	}
}

export class GoodreadsScrapper {
	static async getBookInfo(title: string, otherInfo?: string[]) {
		let response = await axios.get(`${GOODREADS_BASE_URL}/search`, {
			params: {
				q: title,
				ref: 'nav_sb_noss_l_10',
			},
		});

		let $ = cheerio.load(response.data);

		// Select the table with class "tableList"
		let resultsTable = $('.tableList');

		//  if the table is not found, try again with the title and other info
		if (resultsTable.html() === null) {
			response = await axios.get(`${GOODREADS_BASE_URL}/search`, {
				params: {
					q: title + (otherInfo ? ' ' + otherInfo.join(' ') : ''),
					ref: 'nav_sb_noss_l_10',
				},
			});

			$ = cheerio.load(response.data);

			resultsTable = $('.tableList');
		}

		if (resultsTable.html() === null) {
			const zLibraryResultsResponse = await axios.post(
				`${Z_LIBRARY_BASE_URL}/eapi/book/search`,
				{
					message: title + (otherInfo ? ' ' + otherInfo.join(' ') : ''),
				},
				{
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
				}
			);

			let bookResult: ZLibraryBook = zLibraryResultsResponse.data.books.find(
				(book: ZLibraryBook) => book.description !== ''
			);

			if (!bookResult) {
				bookResult = zLibraryResultsResponse.data.books[0];
			}

			bookResult.description = bookResult.description
				?.replace(/<br>/g, '\n')
				.replace(/<.*?>/g, '');

			if (bookResult.href) {
				bookResult.href = `${Z_LIBRARY_BASE_URL}${bookResult.href}`;
			}

			const book: GoodreadsBook = {
				url: bookResult.href,
				title: bookResult.title,
				series: bookResult.series,
				author: bookResult.author,
				cover: bookResult.cover,
				rating: parseFloat(bookResult.interestScore),
				ratingsCount: 0,
				reviewsCount: 0,
				description: bookResult.description,
				genres: [],
				numberOfPages: bookResult.pages,
				type: '',
				firstPublishDate: bookResult.year,
				reviews: [],
			};

			return book;
		}

		const firstResult = resultsTable.find('tbody tr').first();

		const titleUrl = $(firstResult).find('.bookTitle').attr('href')!;
		const author = $(firstResult)
			.find('[itemprop="author"] .authorName__container')
			.map((index, element) => {
				const $element = $(element);
				const authorName = $element.find('span[itemprop="name"]').text();
				const authorRole = $element.find('.role').text();
				return `${authorName}${authorRole ? ' ' + authorRole : ''}`;
			})
			.get()
			.join(', ');

		const rating = parseFloat(
			$(firstResult)
				.find('.minirating')
				.text()
				.match(/([\d.]+) avg rating/)![1]
		);

		const bookUrl = `${GOODREADS_BASE_URL}${titleUrl}`;

		const completeBookData = await axios.get(bookUrl);
		const $bookResult = cheerio.load(completeBookData.data);

		const bookTitle = $bookResult('.BookPageTitleSection__title h1').text();

		const bookSeries = $bookResult('.BookPageTitleSection__title h3').text();

		// Extract rating and reviews
		const ratingsCountText = $bookResult('[data-testid="ratingsCount"]')
			.text()
			.trim()
			.split(/\s+/)[0]
			.replace(',', '');
		const ratingsCount = parseInt(ratingsCountText, 10);
		const reviewsCountText = $bookResult('[data-testid="reviewsCount"]')
			.text()
			.trim()
			.split(/\s+/)[0]
			.replace(',', '');
		const reviewsCount = parseInt(reviewsCountText, 10);

		const cover = $bookResult('.BookCover__image img.ResponsiveImage').attr(
			'src'
		)!;

		// Extract book description
		const bookDescription = $bookResult(
			'.DetailsLayoutRightParagraph__widthConstrained'
		)
			.html()!
			.replace(/<br>/g, '\n')
			.replace(/<.*?>/g, '');

		// Extract list of genres
		const genres = $bookResult('.BookPageMetadataSection__genres a')
			.map((index, element) => $bookResult(element).text())
			.get();

		// Extract number of pages
		const pageFormatSplit = $bookResult('[data-testid="pagesFormat"]')
			.text()
			.trim()
			.split(/\s+/);

		const numberOfPages = pageFormatSplit[0];

		// Extract book type
		const bookType = pageFormatSplit[2];

		// Extract first publish date
		const firstPublishDate = $bookResult('[data-testid="publicationInfo"]')
			.text()
			.trim()
			.split(/\s+/)
			.slice(2)
			.join(' ');

		const book: GoodreadsBook = {
			url: bookUrl,
			series: bookSeries,
			title: bookTitle,
			author,
			cover,
			rating,
			ratingsCount,
			reviewsCount,
			description: bookDescription,
			genres,
			numberOfPages,
			type: bookType,
			firstPublishDate,
			reviews: [],
		};

		$bookResult('.ReviewsList')
			.find('.ReviewCard')
			.slice(0, 10)
			.each((index, element) => {
				const $review = $bookResult(element);
				const userAvatar = $review
					.find('.ReviewerProfile__avatar')
					.find('img')
					.attr('src')!;
				const userName = $review.find('.ReviewerProfile__name').text();

				const reviewRatingText = $review
					.find('.ShelfStatus span')
					.attr('aria-label');

				const reviewRating = parseInt(
					reviewRatingText?.split(' ')[1] || '0',
					10
				);

				const reviewText = $review
					.find('.ReviewText__content')
					.html()!
					.replace(/<br>/g, '\n')
					.replace(/<.*?>/g, '');
				const review = {
					userAvatar,
					userName,
					rating: reviewRating,
					reviewText,
				};

				book.reviews.push(review);
			});

		return book;
	}
}
