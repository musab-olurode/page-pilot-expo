import { FlatList, StyleSheet, Dimensions, View } from 'react-native';
import React from 'react';
import { Appbar, Text } from 'react-native-paper';
import Book from '@/components/Book';
import { ZLibraryBookResult } from '@/types/books';
import EmptyStateEmoticon from '@/components/EmptyStateEmoticon';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { booksKeys } from '@/lib/api/queryKeys';

const screenWidth = Dimensions.get('window').width;
const numberOfColumns = 3;
const containerPadding = 16;
const columnGap = 10;
const tileWidth =
	(screenWidth - containerPadding * 2 - columnGap * 2) / numberOfColumns;

const Library = () => {
	const router = useRouter();
	const queryClient = useQueryClient();

	const handleOnPressBook = (book: ZLibraryBookResult) => {
		queryClient.setQueryData([booksKeys.state], { book });
		router.push('/book-details');
	};

	return (
		<>
			<Appbar.Header>
				<Appbar.Content title='Library' />
				<Appbar.Action icon='magnify' onPress={() => {}} />
			</Appbar.Header>
			<FlatList
				key={1}
				numColumns={3}
				data={[]}
				style={styles.list}
				columnWrapperStyle={styles.grid}
				// columnWrapperClassName='flex flex-col flex-1 h-full gap-y-[0.625rem]'
				renderItem={({ item }) => (
					<Book
						book={item}
						width={tileWidth}
						onPress={() => handleOnPressBook(item)}
					/>
				)}
				// eslint-disable-next-line react-native/no-inline-styles
				contentContainerStyle={{ flex: 1 }}
				ListEmptyComponent={
					<View className='flex-col justify-center items-center flex-1'>
						<View className='pb-4 justify-center items-center'>
							<EmptyStateEmoticon />
						</View>
						<Text className='text-xs'>Your library is empty</Text>
					</View>
				}
			/>
		</>
	);
};

const styles = StyleSheet.create({
	list: {
		paddingHorizontal: 16,
	},
	grid: {
		flex: 1,
		height: '100%',
		columnGap: 10,
	},
});

export default Library;
