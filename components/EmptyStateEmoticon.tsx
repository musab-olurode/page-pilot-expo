import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Text } from 'react-native-paper';

const EMOTICONS = [
	'(ಥ﹏ಥ)',
	'(｡•́︿•̀｡)',
	'(⊙﹏⊙)',
	'(つω`｡)',
	'(っ- ‸ – ς)',
	'(╯︵╰,)',
	'(⌣_⌣”)',
	'(/ω＼)',
	'(╥︣_╥)',
	'(´；д；`)',
];

const EmptyStateEmoticon = () => {
	const [lastSelectedIndex, setLastSelectedIndex] = useState(0);
	const [selectedIndex, setSelectedIndex] = useState(0);

	useFocusEffect(
		useCallback(() => {
			return () => {
				// pick a random emoticon but not the same as the last one
				let randomIndex = Math.floor(Math.random() * EMOTICONS.length);
				while (randomIndex === lastSelectedIndex) {
					randomIndex = Math.floor(Math.random() * EMOTICONS.length);
				}
				setSelectedIndex(randomIndex);
				setLastSelectedIndex(randomIndex);
			};
		}, [])
	);

	return (
		<Text className='text-5xl text-center'>{EMOTICONS[selectedIndex]}</Text>
	);
};

export default EmptyStateEmoticon;
