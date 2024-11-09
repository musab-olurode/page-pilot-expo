import {
	FlatList,
	StyleSheet,
	Dimensions,
	RefreshControl,
	TextInput,
} from 'react-native';
import React, {
	ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import { Appbar, Searchbar, useTheme } from 'react-native-paper';
import Book from '@/components/Book';
import { ZLibraryBookResult } from '@/types/books';
import { useRouter } from 'expo-router';
import { useGetMostPopularBooks } from '@/lib/api/queries/books';
import { useSearchBooks } from '@/lib/api/mutations/books';
import { useQueryClient } from '@tanstack/react-query';
import { booksKeys } from '@/lib/api/queryKeys';

const screenWidth = Dimensions.get('window').width;
const numberOfColumns = 3;
const containerPadding = 16;
const columnGap = 10;
const tileWidth =
	(screenWidth - containerPadding * 2 - columnGap * 2) / numberOfColumns;

const Discover = () => {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState('');
	const [showSearchInput, setShowSearchInput] = useState(false);
	const [books, setBooks] = useState<ZLibraryBookResult[]>([]);
	const {
		isFetching: isPopularBooksFetching,
		refetch: refetchMostPopularBooks,
		data: mostPopularBooks,
	} = useGetMostPopularBooks();
	const {
		mutate: findBook,
		isPending: isSearchLoading,
		data: searchBookResults,
	} = useSearchBooks();
	const theme = useTheme();
	const searchInputRef = useRef<TextInput>(null);
	const flatListRef = useRef<FlatList<ZLibraryBookResult>>(null);
	const queryClient = useQueryClient();

	const handleOnPressBook = (book: ZLibraryBookResult) => {
		queryClient.setQueryData([booksKeys.search, book.title, book.author], book);
		router.push({
			pathname: '/book-details',
			params: {
				bookTitle: book.title,
				bookAuthor: book.author,
			},
		});
	};

	const onRefresh = () => {
		if (isPopularBooksFetching || isSearchLoading) return;
		refetchMostPopularBooks();
	};

	useEffect(() => {
		if (mostPopularBooks) {
			setBooks(mostPopularBooks.books);
		}
	}, [mostPopularBooks]);

	useEffect(() => {
		if (searchBookResults) {
			searchBookResults.books.forEach((book) => {
				book.description = book.description
					?.replace(/<br>/g, '\n')
					.replace(/<.*?>/g, '');
				if (book.cover.startsWith('/')) {
					book.cover = `${process.env.EXPO_PUBLIC_Z_LIBRARY_BASE_URL}${book.cover}`;
				}
			});
			setBooks(searchBookResults.books);
		}
	}, [searchBookResults]);

	return (
		<>
			<Appbar.Header>
				{!showSearchInput && <Appbar.Content title='Discover' />}
				{showSearchInput && (
					<Appbar.Content
						titleStyle={styles.appHeaderText}
						title={
							(
								<Searchbar
									ref={searchInputRef}
									className='bg-transparent'
									placeholder='Search...'
									icon='arrow-left'
									onIconPress={() => {
										setShowSearchInput(false);
										setSearchQuery('');
										setBooks(mostPopularBooks?.books || []);
									}}
									value={searchQuery}
									onChangeText={(text) => setSearchQuery(text)}
									onSubmitEditing={() => {
										if (searchQuery) {
											flatListRef.current?.scrollToOffset({
												offset: 0,
												animated: false,
											});
											findBook({ message: searchQuery });
										}
									}}
								/>
							) as ReactNode & string
						}
					/>
				)}
				{!showSearchInput && (
					<Appbar.Action
						icon='magnify'
						onPress={() => {
							setShowSearchInput(true);
							setTimeout(() => {
								searchInputRef.current?.focus();
							}, 100);
						}}
					/>
				)}
			</Appbar.Header>
			<FlatList
				ref={flatListRef}
				key={1}
				numColumns={3}
				data={books}
				style={styles.list}
				columnWrapperStyle={styles.grid}
				refreshControl={
					<RefreshControl
						progressViewOffset={0}
						progressBackgroundColor={theme.colors.primaryContainer}
						colors={[theme.colors.primary]}
						refreshing={isPopularBooksFetching || isSearchLoading}
						onRefresh={onRefresh}
					/>
				}
				renderItem={({ item }) => (
					<Book
						book={item}
						width={tileWidth}
						onPress={() => handleOnPressBook(item)}
					/>
				)}
			/>
		</>
	);
};

const styles = StyleSheet.create({
	appHeaderText: {
		flex: 1,
	},
	list: {
		paddingHorizontal: 16,
	},
	grid: {
		flex: 1,
		// height: '100%',
		columnGap: 10,
		// rowGap: 40,
	},
});

export default Discover;
