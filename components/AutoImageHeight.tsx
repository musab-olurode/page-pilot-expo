import React from 'react';
import { ImageStyle, StyleProp, View } from 'react-native';
import { Image } from 'expo-image';
import { Icon, useTheme } from 'react-native-paper';

interface AutoHeightImageProps {
	width: number;
	maxHeight?: number;
	source?: any;
	class?: string;
	style?: StyleProp<ImageStyle>;
}

const AutoHeightImage = React.memo(
	({
		width,
		class: className,
		style,
		maxHeight,
		...props
	}: AutoHeightImageProps) => {
		const [imageError, setImageError] = React.useState(false);
		const theme = useTheme();

		return (
			<View
				className='h-fit relative'
				style={{ backgroundColor: theme.colors.secondaryContainer }}
			>
				{(imageError || !props.source) && (
					<View className='absolute right-1/2 translate-x-1/2 top-1/2 -translate-y-1/2'>
						<Icon
							source='image-broken-variant'
							size={40}
							color={theme.colors.onSecondary}
						/>
					</View>
				)}
				<Image
					className={className}
					{...props}
					style={[style, { width, height: 192 }]}
					onError={() => setImageError(true)}
				/>
			</View>
		);
	}
);

export default AutoHeightImage;
