import Color from 'color';
import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, Icon, useTheme } from 'react-native-paper';
import Animated, { LinearTransition } from 'react-native-reanimated';

interface ExpandingTextProps {
	text: string;
	class?: string;
	onToggleExpand?: (expanded: boolean) => void;
}

const ExpandingText = ({
	text,
	onToggleExpand,
	class: className,
}: ExpandingTextProps) => {
	const [expanded, setExpanded] = useState(false);
	const theme = useTheme();

	const changeLayout = () => {
		setExpanded(!expanded);
		onToggleExpand?.(!expanded);
	};

	const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

	return (
		<Animated.View
			layout={LinearTransition}
			className={className}
			style={styles.btnTextHolder}
		>
			<AnimatedPressable
				layout={LinearTransition}
				onPress={changeLayout}
				className='relative'
				style={{ height: expanded ? 'auto' : 50, overflow: 'hidden' }}
			>
				<Text style={{ paddingBottom: expanded ? 30 : 0 }}>{text}</Text>
				<LinearGradient
					colors={
						expanded
							? [
									Color(theme.colors.background).alpha(0).rgb().string(),
									Color(theme.colors.background).alpha(0).rgb().string(),
							  ]
							: [
									Color(theme.colors.background).alpha(0.1).rgb().string(),
									theme.colors.background,
							  ]
					}
					className='absolute bottom-0 w-full flex items-center pt-2'
				>
					<Icon source={expanded ? 'chevron-up' : 'chevron-down'} size={20} />
				</LinearGradient>
			</AnimatedPressable>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	text: {
		fontSize: 17,
		color: 'black',
		padding: 10,
	},
	btnText: {
		textAlign: 'center',
		color: 'white',
		fontSize: 20,
	},
	btnTextHolder: {
		shadowColor: 'rgba(0, 0, 0, 0.03)',
		shadowOffset: {
			width: 0,
			height: 12,
		},
		shadowOpacity: 0.58,
		shadowRadius: 16.0,
		elevation: 24,
	},
});

export default ExpandingText;
