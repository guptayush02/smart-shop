import { saveData } from '@/helpers/expoSecureStore';
import React, { useState } from 'react';
import { Modal, View, Text, Button, Platform, StyleSheet, Dimensions, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import httpRequest from '@/helpers/httpRequests';
import { ThemedText } from './ThemedText';

export default function LoginForm({ showLoginModal, setShowLoginModal, setIsLogin, openSignupModal }:any) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async() => {
    if (!email || !password) {
      return;
    }
    const response:any = await httpRequest.post('api/v1/auth/login', { email, password });
    if (response.data.status === 200) {
      const { data } = response.data;
      saveData('token', data.token);
      saveData('category', data?.vendorCategory?.category);
    }
    setShowLoginModal(false)
    setIsLogin(true)
  }

  return (
    <>
      <Modal
        visible={showLoginModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowLoginModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Login Required</Text>

            <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} />
            <TextInput placeholder="Password" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
            <Button title="Login" onPress={login} />
            <Button title="Cancel" color="red" onPress={() => setShowLoginModal(false)} />
            <ThemedText style={{ color: 'black' }}>Dont have account <TouchableOpacity onPress={openSignupModal}>Click here</TouchableOpacity></ThemedText>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  }
})

