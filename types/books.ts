export interface ZLibraryBookResult {
	id: number;
	title: string;
	author: string;
	cover: string;
	hash: string;
}

export interface ZLibraryBook {
	id: number;
	series: string;
	title: string;
	identifier: string;
	author: string;
	cover: string;
	hash: string;
	description: string;
	href: string;
	pages: string;
	year: string;
	interestScore: string;
}

export interface GoodreadsBookSearchResult {
	url: string;
	title: string;
	author: string;
	rating: number;
	publishedYear?: number;
	cover: string;
}

export interface GoodreadsBook {
	url: string;
	series?: string;
	title: string;
	author: string;
	cover: string;
	rating: number;
	ratingsCount: number;
	reviewsCount: number;
	description: string;
	genres: string[];
	numberOfPages: string;
	type: string;
	firstPublishDate: string;
	reviews: GoodreadsReview[];
}

export interface GoodreadsReview {
	userAvatar: string;
	userName: string;
	rating: number;
	reviewText: string;
}

export interface CombinedBook extends Partial<GoodreadsBook> {
	title: string;
	cover: string;
	author: string;
}

export type GetBookInfoMethod =
	| ((params: {
			isbn: string;
			idAndHash?: { id: string; hash: string };
	  }) => Promise<GoodreadsBook>)
	| ((params: {
			isbn?: string;
			idAndHash: { id: string; hash: string };
	  }) => Promise<GoodreadsBook>);
