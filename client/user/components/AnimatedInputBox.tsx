import React, { useEffect, useRef } from 'react';
import { Platform, StyleSheet, TextInput, TouchableOpacity, Animated, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AnimatedInputBox({ message, setMessage, handleSend }: any) {
  const keyboardHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const keyboardShowListener = Keyboard.addListener(showEvent, (e:any) => {
      Animated.timing(keyboardHeight, {
        toValue: e.endCoordinates.height,
        duration: Platform.OS === 'ios' ? e.duration : 250,
        useNativeDriver: false,
      }).start();
    });

    const keyboardHideListener = Keyboard.addListener(hideEvent, (e:any) => {
      Animated.timing(keyboardHeight, {
        toValue: 0,
        duration: Platform.OS === 'ios' ? e.duration : 250,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, [keyboardHeight]);

  return (
    <Animated.View style={[styless.inputContainer, { marginBottom: keyboardHeight }]}>
      <TextInput
        style={styless.textInput}
        placeholder="Want to buy anything..."
        placeholderTextColor="#999"
        value={message}
        onChangeText={setMessage}
        onSubmitEditing={handleSend}
        returnKeyType="send"
      />
      <TouchableOpacity onPress={handleSend} style={styless.sendButton} activeOpacity={0.8}>
        <Ionicons name="arrow-up-circle" size={28} color="#fff" />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styless = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    borderRadius: 30,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    color: '#333',
  },
  sendButton: {
    marginLeft: 12,
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
