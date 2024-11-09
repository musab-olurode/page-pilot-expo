export const GOODREADS_DEFAULT_AVATAR_URL =
	'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/users/1484794485i/22106879._UX200_CR0,33,200,200_.jpg';
export const STATE_QUERY_OPTIONS = {
	refetchOnMount: false,
	refetchOnReconnect: false,
	refetchOnWindowFocus: false,
};
export const QUERY_CACHE_TIME = 1000 * 60 * 5; // 5 minutes
export const CACHED_QUERY_OPTIONS = {
	staleTime: QUERY_CACHE_TIME,
	// override to fail silently
	throwOnError() {
		return false;
	},
};
