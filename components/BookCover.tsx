import { Pressable, View } from 'react-native';
import React from 'react';
import AutoHeightImage from './AutoImageHeight';
import { Image } from 'expo-image';
import BookSpineImg from '@/assets/images/book-spine.png';

export interface BookCoverProps {
	cover: string;
	width: number;
	onPress?: () => void;
}

const BookCover = ({ cover, width, onPress }: BookCoverProps) => {
	const maxHeight = width * 1.7;

	return (
		<Pressable
			onPress={onPress}
			style={{
				width,
			}}
		>
			<View className='rounded-r-sm overflow-hidden relative'>
				<AutoHeightImage
					source={{ uri: cover }}
					width={width}
					maxHeight={maxHeight}
				/>
				<Image
					source={BookSpineImg}
					style={{ width: 6, height: '100%', position: 'absolute', left: 1.5 }}
				/>
			</View>
		</Pressable>
	);
};

export default BookCover;
