import { Pressable, StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import {
	Appbar,
	Button,
	Dialog,
	Icon,
	List,
	Portal,
	Text,
	TextInput,
	useTheme,
} from 'react-native-paper';
import ZLibraryIconImg from '@/assets/icons/zlibrary.png';
import PasswordInput from '@/components/PasswordInput';
import { useRouter } from 'expo-router';

const Screen = () => {
	const theme = useTheme();
	const [visible, setVisible] = useState(false);
	const [text, setText] = useState('');
	const navigation = useRouter();

	const showDialog = () => setVisible(true);

	const hideDialog = () => setVisible(false);

	return (
		<>
			<Appbar.Header>
				<Appbar.BackAction onPress={() => navigation.back()} />
				<Appbar.Content title='Services' />
			</Appbar.Header>
			<View
				// eslint-disable-next-line react-native/no-inline-styles
				style={{ backgroundColor: theme.colors.background, flex: 1 }}
			>
				<List.Item
					className='px-4'
					title='ZLibrary'
					// eslint-disable-next-line react/no-unstable-nested-components
					left={() => (
						<List.Image
							style={styles.serviceIcon}
							variant='image'
							source={ZLibraryIconImg}
						/>
					)}
					onPress={showDialog}
				/>
				<Portal>
					<Dialog visible={visible} onDismiss={hideDialog}>
						{/* <Dialog.Title className="flex flex-row">
              Log in to Zlibrary
              <Icon size={10} source="close" />
            </Dialog.Title> */}
						<Dialog.Content className='flex flex-col gap-y-2'>
							<View className='flex flex-row justify-between items-center pb-3'>
								<Text className='text-2xl'>Log in to Zlibrary</Text>
								<Pressable onPress={hideDialog}>
									<Icon size={20} source='close' />
								</Pressable>
							</View>
							<TextInput
								style={{ backgroundColor: theme.colors.elevation.level0 }}
								mode='outlined'
								label='Email'
								value={text}
								onChangeText={(text) => setText(text)}
							/>
							<PasswordInput
								style={{ backgroundColor: theme.colors.elevation.level0 }}
								mode='outlined'
								label='Password'
								value={text}
								onChangeText={(text) => setText(text)}
							/>
							<View className='pt-4'>
								<Button mode='contained' className='grow'>
									Login
								</Button>
							</View>
						</Dialog.Content>
					</Dialog>
				</Portal>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	serviceIcon: {
		borderRadius: 10,
		height: 5,
		width: 5,
	},
});

export default Screen;
