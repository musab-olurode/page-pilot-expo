import '@/styles/global.css';

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { PaperProvider, Snackbar } from 'react-native-paper';
import {
	QueryClient,
	QueryClientProvider,
	useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ThemeProvider } from '@react-navigation/native';
import useMaterialYouTheme from '@/lib/hooks/useMaterialYouTheme';
import { useGetSnackbarState } from '@/lib/api/state/snackBar';
import { snackbarKeys } from '@/lib/api/queryKeys';
import { SafeAreaView } from 'react-native';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
	});
	const { paperTheme, navigationTheme } = useMaterialYouTheme();

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				throwOnError(error) {
					handleOnRequestError(error);
					return false;
				},
			},
			mutations: {
				onError: handleOnRequestError,
				onSuccess: handleOnRequestSuccess,
			},
		},
	});

	function handleOnRequestError(error: AxiosError<any, any> | Error) {
		let errorMessage =
			(error as AxiosError<any>).response?.data.message[0] ||
			error.message ||
			'Request failed';
		console.log(error);

		// toast({
		// 	title: 'Request Failed',
		// 	description: errorMessage,
		// 	status: 'error',
		// 	duration: TOAST_DURATION,
		// 	isClosable: true,
		// });
	}

	function handleOnRequestSuccess(data: unknown) {
		// toast({
		// 	title: 'Request Succeeded',
		// 	description: (data as Response<any>).message[0] || 'Success',
		// 	status: 'success',
		// 	duration: TOAST_DURATION,
		// 	isClosable: true,
		// });
	}

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	const App = () => {
		const { data: snackbar } = useGetSnackbarState();
		const queryClient = useQueryClient();

		return (
			<>
				<Stack>
					<Stack.Screen name='(tabs)' options={{ headerShown: false }} />
					<Stack.Screen name='+not-found' />
					<Stack.Screen name='book-details' options={{ headerShown: false }} />
					<Stack.Screen
						name='custom-webview'
						options={{ headerShown: false }}
					/>
					<Stack.Screen name='services' options={{ headerShown: false }} />
				</Stack>
				<Snackbar
					duration={3000}
					visible={snackbar?.showSnackbar || false}
					onDismiss={() =>
						queryClient.invalidateQueries({ queryKey: [snackbarKeys.state] })
					}
				>
					{snackbar?.message}
				</Snackbar>
			</>
		);
	};

	return (
		<PaperProvider theme={paperTheme}>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider value={navigationTheme}>
					<SafeAreaView className='flex-1'>
						<App />
					</SafeAreaView>
				</ThemeProvider>
			</QueryClientProvider>
		</PaperProvider>
	);
}
