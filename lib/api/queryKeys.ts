const booksNamespace = 'books';
export const booksKeys = {
	create: `${booksNamespace}/create`,
	read: `${booksNamespace}/read`,
	patch: `${booksNamespace}/patch`,
	delete: `${booksNamespace}/delete`,
	readMostPopular: `${booksNamespace}/readMostPopular`,
	search: `${booksNamespace}/search`,
	state: `${booksNamespace}/state`,
};

const snackbarNamespace = 'snackbar';
export const snackbarKeys = {
	state: `${snackbarNamespace}/state`,
};
