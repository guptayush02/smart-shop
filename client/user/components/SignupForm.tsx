import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import httpRequest from '@/helpers/httpRequests';
import { saveToken } from '@/helpers/expoSecureStore';
import { ThemedText } from './ThemedText';

export default function SignupForm({
  showSignupModal,
  setShowSignupModal,
  setIsLogin,
  openLoginModal,
}: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const signup = async () => {
    if (!email.trim() || !password || !name.trim() || !address.trim()) {
      Alert.alert('Validation', 'Please fill all the fields.');
      return;
    }

    try {
      const response: any = await httpRequest.post('api/v1/auth/create-account', {
        email,
        password,
        name,
        address,
        role: 'user',
      });

      if (response.data.status === 200) {
        // Optionally save token here or redirect to login
        Alert.alert('Success', response.data.message || 'Account created successfully!');
        setShowSignupModal(false);
        openLoginModal();

        // Reset form fields
        setEmail('');
        setPassword('');
        setName('');
        setAddress('');
      } else {
        Alert.alert('Signup Failed', response.data.message || 'Something went wrong!');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Signup error occurred.');
    }
  };

  return (
    <Modal
      visible={showSignupModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowSignupModal(false)}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalContainer}>
            <ThemedText type="title" style={styles.modalTitle}>
              Signup
            </ThemedText>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                placeholder="Enter your full name"
                style={styles.input}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                placeholder="Enter your email"
                style={styles.input}
                keyboardType="email-address"
                textContentType="emailAddress"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                placeholder="Enter your password"
                style={styles.input}
                secureTextEntry
                textContentType="password"
                value={password}
                onChangeText={setPassword}
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                placeholder="Enter your address"
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                returnKeyType="done"
                onSubmitEditing={signup}
              />
            </View>

            <TouchableOpacity style={styles.signupButton} onPress={signup} activeOpacity={0.8}>
              <Text style={styles.signupButtonText}>Signup</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowSignupModal(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <View style={styles.loginPrompt}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={openLoginModal} activeOpacity={0.7}>
                <Text style={styles.loginLink}>Click here</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const COLORS = {
  primary: '#007AFF',
  background: '#fff',
  text: '#000',
  placeholder: '#999',
  cancelRed: '#FF3B30',
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 20,
    padding: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  modalTitle: {
    marginBottom: 20,
    fontWeight: '700',
    fontSize: 22,
    textAlign: 'center',
    color: COLORS.primary,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    fontWeight: '600',
    color: COLORS.text,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.text,
  },
  signupButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 10,
  },
  signupButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.cancelRed,
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 12,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
    textAlign: 'center',
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },
  loginText: {
    color: COLORS.text,
    fontSize: 14,
  },
  loginLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});

