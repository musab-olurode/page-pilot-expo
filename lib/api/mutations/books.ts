import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { BookInfoRequest, ZLibrarySearchBooksRequest } from '../types';
import { booksKeys } from '../queryKeys';
import { searchForBook } from '../requests/books';
import { GoodreadsBook, ZLibraryBook } from '@/types/books';
import { GoodreadsService } from '@/lib/services/goodreads';
import { useLocalSearchParams } from 'expo-router';

export const useSearchBooks = (
	options?: Partial<
		UseMutationOptions<
			{ books: ZLibraryBook[] },
			AxiosError,
			ZLibrarySearchBooksRequest,
			unknown
		>
	>
) => {
	return useMutation({
		mutationKey: [booksKeys.search],
		mutationFn: searchForBook,
		...options,
	});
};

// export const useGetGoodreadsBookInfo = (
// 	options?: Partial<
// 		UseMutationOptions<GoodreadsBook, AxiosError, BookInfoRequest, unknown>
// 	>
// ) => {
// 	const params = useLocalSearchParams();
// 	const goodreadsService = new GoodreadsService();
// 	return useMutation({
// 		mutationKey: [booksKeys.search, params.bookTitle],
// 		mutationFn: goodreadsService.fetchBookInfo,
// 		...options,
// 	});
// };
