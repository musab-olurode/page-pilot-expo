import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { CombinedBook } from '@/types/books';
import { booksKeys } from '../queryKeys';
import { STATE_QUERY_OPTIONS } from '@/lib/constants';

export const useGetBookState = (
	options?: Partial<
		UseQueryOptions<unknown, unknown, { book?: CombinedBook }, string[]>
	>
) => {
	return useQuery({
		queryKey: [booksKeys.state],
		queryFn: () => ({ book: undefined }),
		...options,
		...STATE_QUERY_OPTIONS,
	});
};
