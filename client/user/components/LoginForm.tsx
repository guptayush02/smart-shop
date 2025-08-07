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
} from 'react-native';
import { ThemedText } from './ThemedText';
import { saveToken } from '@/helpers/expoSecureStore';
import httpRequest from '@/helpers/httpRequests';

export default function LoginForm({
  showLoginModal,
  setShowLoginModal,
  setIsLogin,
  openSignupModal,
}: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    if (!email.trim() || !password) return;
    try {
      const response: any = await httpRequest.post('api/v1/auth/login', {
        email,
        password,
      });
      if (response.data.status === 200) {
        const { data } = response.data;
        await saveToken('token', data.token);
        setShowLoginModal(false);
        setIsLogin(true);
        setEmail('');
        setPassword('');
      } else {
        alert(response.data.message || 'Login failed');
      }
    } catch (error) {
      alert('Login error: ' + error.message);
    }
  };

  return (
    <Modal
      visible={showLoginModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowLoginModal(false)}
      statusBarTranslucent
    >
      {/* Dismiss keyboard when clicking outside inputs */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalContainer}>
            <ThemedText type="title" style={styles.modalTitle}>
              Login Required
            </ThemedText>

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
                onSubmitEditing={() => {
                  // focusing password input requires ref, optional enhancement
                }}
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
                returnKeyType="done"
                onSubmitEditing={login}
              />
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={login} activeOpacity={0.8}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowLoginModal(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <View style={styles.signupPrompt}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={openSignupModal} activeOpacity={0.7}>
                <Text style={styles.signupLink}>Click here</Text>
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
    elevation: 10, // Android shadow
    shadowColor: '#000', // iOS shadow
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
  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 10,
  },
  loginButtonText: {
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
  signupPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },
  signupText: {
    color: COLORS.text,
    fontSize: 14,
  },
  signupLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
