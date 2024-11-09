import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getMostPopularBooks } from '../requests/books';
import { GoodreadsBook, ZLibraryBookResult } from '@/types/books';
import { booksKeys } from '../queryKeys';
import { useLocalSearchParams } from 'expo-router';
import { GoodreadsService } from '@/lib/services/goodreads';

export const useGetMostPopularBooks = (
	options?: Partial<
		UseQueryOptions<
			unknown,
			AxiosError,
			{ books: ZLibraryBookResult[] },
			string[]
		>
	>
) => {
	return useQuery({
		queryKey: [booksKeys.readMostPopular],
		queryFn: getMostPopularBooks,
		...options,
	});
};

export const useGetGoodreadsBookInfo = (
	options?: Partial<
		UseQueryOptions<unknown, AxiosError, GoodreadsBook, string[]>
	>
) => {
	const params = useLocalSearchParams();
	const goodreadsService = new GoodreadsService();

	return useQuery({
		queryKey: [
			booksKeys.search,
			params.bookTitle as string,
			params.bookAuthor as string,
		],
		queryFn: () =>
			goodreadsService.fetchBookInfo({
				title: params.bookTitle as string,
				otherInfo: params.bookAuthor ? [params.bookAuthor as string] : [],
			}),
		...options,
	});
};
