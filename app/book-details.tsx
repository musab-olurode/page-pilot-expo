import React, { useState } from 'react';
import {
	View,
	StyleSheet,
	ScrollView,
	RefreshControl,
	FlatList,
	Share,
	ImageBackground,
	StatusBar,
} from 'react-native';
import {
	Text,
	Appbar,
	Avatar,
	Button,
	Chip,
	Icon,
	List,
	MD3Theme,
	Menu,
	useTheme,
} from 'react-native-paper';
import ExpandingText from '@/components/ExpandingText';
import { CombinedBook, GoodreadsReview } from '@/types/books';
import { GOODREADS_DEFAULT_AVATAR_URL } from '@/lib/constants';
import { LinearGradient } from 'expo-linear-gradient';
import StarRating from '@/components/StarRating';
import { useRouter } from 'expo-router';
import Color from 'color';
import { cn } from '@/lib/utils';
import { useGetGoodreadsBookInfo } from '@/lib/api/queries/books';
import BookCover from '@/components/BookCover';

const ListEmptyComponent = () => (
	<View className='flex flex-row justify-center items-center p-4'>
		<Text>No reviews found</Text>
	</View>
);

const ListFooterComponent = ({ onPress }: { onPress: () => void }) => (
	<View className='flex flex-row justify-end'>
		<Button
			icon='open-in-new'
			contentStyle={styles.seeMoreReviewsButton}
			onPress={onPress}
		>
			See more reviews
		</Button>
	</View>
);

const ListHeaderComponent = ({
	bookDetails,
	theme,
	descriptionExpanded,
	setDescriptionExpanded,
	handleOnPressWebview,
	webviewUrl,
}: {
	bookDetails?: CombinedBook;
	theme: MD3Theme;
	descriptionExpanded: boolean;
	setDescriptionExpanded: React.Dispatch<React.SetStateAction<boolean>>;
	handleOnPressWebview: () => void;
	webviewUrl?: string;
}) => (
	<>
		<ImageBackground
			source={{ uri: bookDetails?.cover }}
			style={{ paddingTop: 110, paddingHorizontal: 16 }}
		>
			<LinearGradient
				colors={[
					Color(theme.colors.background).alpha(0.8).rgb().string(),
					theme.colors.background,
				]}
				className='absolute left-0 right-0 top-0 bottom-0'
			/>
			<View className='flex flex-row items-center'>
				<View className='flex flex-col justify-end h-[192]'>
					<BookCover cover={bookDetails?.cover || ''} width={128} />
				</View>
				<View className='pl-4 flex-col flex-1'>
					<Text className='text-sm italic'>
						{bookDetails?.series || 'Unknown Series'}
					</Text>
					<Text className='text-xl font-bold'>{bookDetails?.title}</Text>
					<Text className='text-sm'>{bookDetails?.author}</Text>
					<View className='flex flex-row items-center pt-2'>
						<StarRating class='pl-2' rating={bookDetails?.rating || 0} />
						<Text className='px-2'>·</Text>
						<Text className='font-bold'>
							{bookDetails?.rating?.toFixed(2) || '0'}
						</Text>
					</View>
					<Text className='pt-1'>
						{bookDetails?.ratingsCount?.toLocaleString(undefined, {
							useGrouping: true,
						}) || 0}{' '}
						ratings
					</Text>
				</View>
			</View>
		</ImageBackground>
		<View className='flex flex-row items-center py-4 px-4'>
			<Button
				icon='heart-outline'
				mode='contained-tonal'
				className='grow'
				style={styles.actionButton}
			>
				Add to library
			</Button>
			<Button
				disabled={!webviewUrl}
				accessibilityLabel='Webview'
				mode='contained-tonal'
				icon='earth'
				onPress={handleOnPressWebview}
				className='grow'
				style={styles.actionButton}
			>
				WebView
			</Button>
		</View>
		<ExpandingText
			class='mx-4'
			onToggleExpand={setDescriptionExpanded}
			text={bookDetails?.description || 'No Description'}
		/>
		<ScrollView
			horizontal={!descriptionExpanded}
			showsHorizontalScrollIndicator={false}
			contentContainerClassName={cn(
				'px-4 gap-1',
				descriptionExpanded && 'flex flex-1 flex-row flex-wrap'
			)}
			className='pt-3'
		>
			{bookDetails?.genres?.map((genre) => (
				<Chip key={genre}>{genre}</Chip>
			))}
		</ScrollView>
		<View className='flex flex-row justify-between items-end px-4'>
			<View className='flex flex-row items-end pt-4'>
				<Text className='text-xs'>
					{bookDetails?.numberOfPages || '0'} pages,
				</Text>
				<Text className='text-xs pl-1'>
					{bookDetails?.type || 'Unknown Book Type'}
				</Text>
			</View>
			<Text className='text-xs pt-1'>
				First published {bookDetails?.firstPublishDate || 'Unknown'}
			</Text>
		</View>
		<Text className='font-bold text-md pt-4 px-4'>Reviews</Text>
	</>
);

const Review = ({ review }: { review: GoodreadsReview; theme: MD3Theme }) => (
	<List.Accordion
		// eslint-disable-next-line react-native/no-inline-styles
		style={{
			paddingVertical: 0,
		}}
		title={review.userName}
		// eslint-disable-next-line react-native/no-inline-styles
		titleStyle={{
			width: '90%',
		}}
		description={`Rating: ${review.rating}`}
		// eslint-disable-next-line react/no-unstable-nested-components
		left={(props) => (
			<Avatar.Image
				size={24}
				{...props}
				source={{ uri: review.userAvatar || GOODREADS_DEFAULT_AVATAR_URL }}
			/>
		)}
		// eslint-disable-next-line react/no-unstable-nested-components
		right={(props) => (
			<View className='flex flex-row items-center justify-center gap-x-8'>
				<StarRating class='pl-2' rating={review.rating || 0} />
				<Icon
					size={20}
					source={props.isExpanded ? 'chevron-up' : 'chevron-down'}
				/>
			</View>
		)}
	>
		<Text className='pr-8'>{review.reviewText}</Text>
	</List.Accordion>
);

const BookDetails = () => {
	const { data: bookDetails, isFetching, refetch } = useGetGoodreadsBookInfo();
	const [descriptionExpanded, setDescriptionExpanded] = useState(false);
	const [menuVisible, setMenuVisible] = useState(false);
	const [isAtScrollTop, setIsAtScrollTop] = useState(true);
	const theme = useTheme();
	const router = useRouter();

	const handleOnPressWebview = () => {
		router.push({
			pathname: '/custom-webview',
			params: {
				url: bookDetails?.url,
				title: bookDetails?.title,
			},
		});
	};

	const handleOnPressGotoWebviewReviews = () => {
		router.push({
			pathname: '/custom-webview',
			params: {
				url: bookDetails?.url + '#CommunityReviews',
				title: bookDetails?.title,
			},
		});
	};

	const shareLink = async () => {
		setMenuVisible(false);
		Share.share(
			{
				message: bookDetails?.url,
				url: bookDetails?.url!,
				title: bookDetails?.title,
			},
			{
				dialogTitle: bookDetails?.title,
			}
		);
	};

	const closeMenu = () => setMenuVisible(false);
	const openMenu = () => setMenuVisible(true);

	return (
		<>
			<StatusBar
				backgroundColor={
					isAtScrollTop ? 'transparent' : theme.colors.surfaceVariant
				}
				barStyle={theme.dark ? 'light-content' : 'dark-content'}
				translucent={true}
			/>
			<Appbar.Header
				statusBarHeight={0}
				style={[
					styles.appBar,
					!isAtScrollTop && { backgroundColor: theme.colors.surfaceVariant },
				]}
			>
				<Appbar.BackAction onPress={() => router.back()} />
				<Appbar.Content
					// eslint-disable-next-line react-native/no-inline-styles
					className='bg-transparent'
					title={!isAtScrollTop ? bookDetails?.title : ''}
				/>
				<Menu
					visible={menuVisible}
					onDismiss={closeMenu}
					anchor={
						<Appbar.Action
							icon='dots-vertical'
							onPress={openMenu}
							disabled={!bookDetails?.url}
						/>
					}
					anchorPosition='bottom'
				>
					<Menu.Item onPress={shareLink} title='Share' />
				</Menu>
			</Appbar.Header>
			<FlatList
				refreshControl={
					<RefreshControl
						progressViewOffset={90}
						progressBackgroundColor={theme.colors.primaryContainer}
						colors={[theme.colors.primary]}
						refreshing={isFetching}
						onRefresh={refetch}
					/>
				}
				className='flex'
				// eslint-disable-next-line react-native/no-inline-styles
				style={{ backgroundColor: theme.colors.background, flex: 1 }}
				ListHeaderComponent={
					<ListHeaderComponent
						bookDetails={bookDetails}
						theme={theme}
						descriptionExpanded={descriptionExpanded}
						setDescriptionExpanded={setDescriptionExpanded}
						handleOnPressWebview={handleOnPressWebview}
						webviewUrl={bookDetails?.url}
					/>
				}
				data={bookDetails?.reviews}
				keyExtractor={(item, index) =>
					`${item.userName.replace(' ', '-')}-${index}`
				}
				contentContainerClassName='pb-5'
				renderItem={({ item: review }) => (
					<Review theme={theme} review={review} />
				)}
				ListEmptyComponent={ListEmptyComponent}
				ListFooterComponent={
					bookDetails?.reviews && bookDetails?.reviews?.length === 10 ? (
						<ListFooterComponent onPress={handleOnPressGotoWebviewReviews} />
					) : null
				}
				// change appbar background color to white when scrolling
				onScroll={(event) => {
					const scrollPosition = event.nativeEvent.contentOffset.y;
					if (scrollPosition > 0) {
						setIsAtScrollTop(false);
					} else {
						setIsAtScrollTop(true);
					}
				}}
			/>
		</>
	);
};

const styles = StyleSheet.create({
	appBar: {
		backgroundColor: 'transparent',
		position: 'absolute',
		zIndex: 1,
		top: (StatusBar.currentHeight || 0) - 4,
		left: 0,
		width: '100%',
	},
	actionButton: {
		backgroundColor: 'transparent',
	},
	seeMoreReviewsButton: {
		flexDirection: 'row-reverse',
	},
});

export default BookDetails;
