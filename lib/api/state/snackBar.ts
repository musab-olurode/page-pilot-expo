import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { snackbarKeys } from '../queryKeys';
import { STATE_QUERY_OPTIONS } from '@/lib/constants';

export const useGetSnackbarState = (
	options?: Partial<
		UseQueryOptions<
			unknown,
			unknown,
			{ showSnackbar: boolean; message?: string },
			string[]
		>
	>
) => {
	return useQuery({
		queryKey: [snackbarKeys.state],
		queryFn: () => ({ showSnackbar: false, message: '' }),
		...options,
		...STATE_QUERY_OPTIONS,
	});
};
