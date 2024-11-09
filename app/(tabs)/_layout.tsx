import { CommonActions } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import React from 'react';
import { BottomNavigation, Icon } from 'react-native-paper';

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
			}}
			tabBar={({ navigation, state, descriptors, insets }) => (
				<BottomNavigation.Bar
					navigationState={state}
					safeAreaInsets={insets}
					onTabPress={({ route, preventDefault }) => {
						const event = navigation.emit({
							type: 'tabPress',
							target: route.key,
							canPreventDefault: true,
						});

						if (event.defaultPrevented) {
							preventDefault();
						} else {
							navigation.dispatch({
								...CommonActions.navigate(route.name, route.params),
								target: state.key,
							});
						}
					}}
					renderIcon={({ route, focused, color }) => {
						const { options } = descriptors[route.key];
						if (options.tabBarIcon) {
							return options.tabBarIcon({ focused, color, size: 24 });
						}

						return null;
					}}
					getLabelText={({ route }) => {
						const { options } = descriptors[route.key];
						const label =
							options.title !== undefined ? options.title : route.name;

						return label;
					}}
				/>
			)}
		>
			<Tabs.Screen
				name='index'
				options={{
					title: 'Library',
					tabBarIcon: (props) => (
						<Icon
							{...props}
							size={20}
							source={
								props.focused
									? 'bookmark-box-multiple'
									: 'bookmark-box-multiple-outline'
							}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name='discover'
				options={{
					title: 'Discover',
					tabBarIcon: (props) => (
						<Icon
							{...props}
							size={20}
							source={props.focused ? 'compass' : 'compass-outline'}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name='menu'
				options={{
					title: 'Menu',
					tabBarIcon: (props) => (
						<Icon {...props} size={20} source='dots-horizontal' />
					),
				}}
			/>
		</Tabs>
	);
}
