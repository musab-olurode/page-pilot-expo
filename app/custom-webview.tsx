import { View, StyleSheet, Linking, Share } from 'react-native';
import React, { ReactNode, useRef, useState } from 'react';
import WebView from 'react-native-webview';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
	Appbar,
	IconButton,
	Menu,
	ProgressBar,
	Text,
} from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { snackbarKeys } from '@/lib/api/queryKeys';

const CustomWebView = () => {
	const { url, title } = useLocalSearchParams();
	const [loadingProgress, setLoadingProgress] = useState(0);
	const [webviewProperties, setWebviewProperties] = useState({
		canGoBack: false,
		canGoForward: false,
		title: title as string,
		url: url as string,
	});
	const [menuVisible, setMenuVisible] = useState(false);
	const webviewRef = useRef<WebView>(null);
	const navigation = useRouter();
	const queryClient = useQueryClient();

	const closeMenu = () => setMenuVisible(false);
	const openMenu = () => setMenuVisible(true);

	const refreshWebview = () => {
		webviewRef.current?.reload();
		setMenuVisible(false);
	};

	const clearCookies = () => {
		webviewRef.current?.clearCache?.(true);
		setMenuVisible(false);
	};

	const openInBrowser = () => {
		Linking.openURL(webviewProperties.url).catch(() => {
			queryClient.setQueryData([snackbarKeys.state], {
				showSnackbar: true,
				message: "Don't know how to open URI: " + webviewProperties.url,
			});
		});
		setMenuVisible(false);
	};

	const shareLink = async () => {
		setMenuVisible(false);
		Share.share(
			{
				message: webviewProperties.url,
				url: webviewProperties.url,
				title: webviewProperties.title,
			},
			{
				dialogTitle: webviewProperties.title,
			}
		);
	};

	return (
		<>
			<Appbar.Header>
				<Appbar.Action icon='close' onPress={() => navigation.back()} />
				<Appbar.Content
					className='text-sm'
					titleStyle={styles.appHeaderText}
					title={
						(
							<View className='flex flex-col'>
								<Text numberOfLines={1} className='font-bold'>
									{webviewProperties.title}
								</Text>
								<Text numberOfLines={1} className='text-xs'>
									{webviewProperties.url}
								</Text>
							</View>
						) as ReactNode & string
					}
				/>
				<Appbar.Content
					className='text-sm'
					style={styles.appBarRightContent}
					title={
						(
							<View className='flex flex-row gap-x-0'>
								<IconButton
									icon='arrow-left'
									disabled={!webviewProperties.canGoBack}
									className='mx-0'
									onPress={() => {
										webviewRef.current?.goBack();
									}}
								/>
								<IconButton
									icon='arrow-right'
									className='mx-0'
									disabled={!webviewProperties.canGoForward}
									onPress={() => {
										webviewRef.current?.goForward();
									}}
								/>
								<Menu
									visible={menuVisible}
									onDismiss={closeMenu}
									anchorPosition='bottom'
									anchor={
										<IconButton
											icon='dots-vertical'
											className='mx-0'
											onPress={openMenu}
										/>
									}
								>
									<Menu.Item onPress={refreshWebview} title='Refresh' />
									<Menu.Item onPress={shareLink} title='Share' />
									<Menu.Item onPress={openInBrowser} title='Open in browser' />
									<Menu.Item onPress={clearCookies} title='Clear cookies' />
								</Menu>
							</View>
						) as any
					}
				/>
			</Appbar.Header>
			{loadingProgress < 1 && (
				<ProgressBar className='h-0.5' progress={loadingProgress} />
			)}
			<WebView
				source={{ uri: url as string }}
				ref={webviewRef}
				onLoadProgress={({ nativeEvent }) => {
					setLoadingProgress(nativeEvent.progress);
				}}
				onLoad={(syntheticEvent) => {
					const { nativeEvent } = syntheticEvent;
					setWebviewProperties({
						canGoBack: nativeEvent.canGoBack,
						canGoForward: nativeEvent.canGoForward,
						title: nativeEvent.title,
						url: nativeEvent.url,
					});
				}}
			/>
		</>
	);
};

const styles = StyleSheet.create({
	appHeaderText: {
		fontSize: 15,
		flex: 1,
	},
	appBarRightContent: {
		flex: 0,
		flexShrink: 1,
	},
});

export default CustomWebView;
