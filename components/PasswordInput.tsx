import {Pressable, View} from 'react-native';
import React, {useState} from 'react';
import {Icon, TextInput, TextInputProps} from 'react-native-paper';

const PasswordInput = (props: TextInputProps) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <View className="relative">
      <TextInput
        {...props}
        keyboardType="visible-password"
        secureTextEntry={!passwordVisible}
      />
      <Pressable
        className="absolute right-3 top-[45%] -translate-y-1/2"
        onPress={() => setPasswordVisible(!passwordVisible)}>
        <Icon size={20} source={!passwordVisible ? 'eye' : 'eye-off'} />
      </Pressable>
    </View>
  );
};

export default PasswordInput;
