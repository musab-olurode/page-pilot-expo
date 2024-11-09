import { FlatList, StyleSheet, View } from 'react-native';
import React from 'react';
import { Divider, List, Text } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import { useRouter } from 'expo-router';

const MENU_ITEMS: {
	icon: IconSource;
	title: string;
	href: string;
}[] = [{ icon: 'sync', title: 'Services', href: 'services' }];

const Screen = () => {
	const router = useRouter();

	return (
		<FlatList
			ListHeaderComponent={
				<View>
					<View className='flex flex-row justify-center items-center py-8'>
						<Text>¯\_(ツ)_/¯</Text>
					</View>
					<Divider className='h-[0.45px]' />
				</View>
			}
			data={MENU_ITEMS}
			style={styles.list}
			renderItem={({ item }) => (
				<List.Item
					title={item.title}
					// eslint-disable-next-line react/no-unstable-nested-components
					left={(props) => <List.Icon {...props} icon={item.icon} />}
					onPress={() => router.push(item.href)}
				/>
			)}
			// eslint-disable-next-line react-native/no-inline-styles
			contentContainerStyle={{ flex: 1 }}
		/>
	);
};

const styles = StyleSheet.create({
	list: {},
});

export default Screen;
