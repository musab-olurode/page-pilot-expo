import {
	adaptNavigationTheme,
	MD3DarkTheme,
	MD3LightTheme,
} from 'react-native-paper';
import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { useColorScheme } from 'react-native';
import {
	DarkTheme as NavigationDarkTheme,
	DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';

const useMaterialYouTheme = () => {
	const colorScheme = useColorScheme();
	const { theme } = useMaterial3Theme({ fallbackSourceColor: '#3E8260' });

	const paperTheme =
		colorScheme === 'dark'
			? { ...MD3DarkTheme, colors: theme.dark }
			: { ...MD3LightTheme, colors: theme.light };
	const { LightTheme, DarkTheme } = adaptNavigationTheme({
		reactNavigationLight: NavigationDefaultTheme,
		reactNavigationDark: NavigationDarkTheme,
		materialLight: { ...MD3LightTheme, colors: theme.light },
		materialDark: { ...MD3DarkTheme, colors: theme.dark },
	});
	const navigationTheme = colorScheme === 'dark' ? DarkTheme : LightTheme;

	return { paperTheme, navigationTheme };
};

export default useMaterialYouTheme;
