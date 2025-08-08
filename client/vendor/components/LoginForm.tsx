// import { saveData } from '@/helpers/expoSecureStore';
// import React, { useState } from 'react';
// import { Modal, View, Text, Button, Platform, StyleSheet, Dimensions, ScrollView, TextInput, TouchableOpacity } from 'react-native';
// import httpRequest from '@/helpers/httpRequests';
// import { ThemedText } from './ThemedText';

// export default function LoginForm({ showLoginModal, setShowLoginModal, setIsLogin, openSignupModal }:any) {

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const login = async() => {
//     if (!email || !password) {
//       return;
//     }
//     const response:any = await httpRequest.post('api/v1/auth/login', { email, password });
//     if (response.data.status === 200) {
//       const { data } = response.data;
//       saveData('token', data.token);
//       saveData('category', data?.vendorCategory?.category);
//     }
//     setShowLoginModal(false)
//     setIsLogin(true)
//   }

//   return (
//     <>
//       <Modal
//         visible={showLoginModal}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setShowLoginModal(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <Text style={styles.modalTitle}>Login Required</Text>

//             <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} />
//             <TextInput placeholder="Password" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
//             <Button title="Login" onPress={login} />
//             <Button title="Cancel" color="red" onPress={() => setShowLoginModal(false)} />
//             {/* <ThemedText style={{ color: 'black' }}>Dont have account <TouchableOpacity onPress={openSignupModal}>Click here</TouchableOpacity></ThemedText> */}
//             <View style={styles.signupPrompt}>
//               <Text style={styles.signupText}>Don't have an account? </Text>
//               <TouchableOpacity onPress={openSignupModal} activeOpacity={0.7}>
//                 <Text style={styles.signupLink}>Click here</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </>
//   );
// }

// const COLORS = {
//   primary: '#007AFF',
//   background: '#fff',
//   text: '#000',
//   placeholder: '#999',
//   cancelRed: '#FF3B30',
// };

// const styles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContainer: {
//     width: '80%',
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 20,
//     elevation: 5,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 10,
//     width: '100%',
//   },
//   signupPrompt: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 18,
//   },
//   signupText: {
//     color: COLORS.text,
//     fontSize: 14,
//   },
//   signupLink: {
//     color: COLORS.primary,
//     fontSize: 14,
//     fontWeight: '700',
//     textDecorationLine: 'underline',
//   },
// })

import React, { useState } from 'react';
import {
  Modal,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Platform,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import httpRequest from '@/helpers/httpRequests';
import { ThemedText } from './ThemedText';
import { saveData } from '@/helpers/expoSecureStore';

const COLORS = {
  primary: '#007AFF',
  background: '#fff',
  text: '#222',
  placeholder: '#999',
  cancelRed: '#FF3B30',
};

export default function LoginForm({
  showLoginModal,
  setShowLoginModal,
  setIsLogin,
  openSignupModal,
}: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    if (!email.trim() || !password) {
      alert('Please enter both email and password!');
      return;
    }
    try {
      const response: any = await httpRequest.post('api/v1/auth/login', { email, password });
      if (response.data.status === 200) {
        const { data } = response.data;
        saveData('token', data.token);
        saveData('category', data?.vendorCategory?.category);
        setShowLoginModal(false);
        setIsLogin(true);
        setEmail('');
        setPassword('');
      } else {
        alert(response.data.message || 'Login failed');
      }
    } catch (err: any) {
      alert('Login error: ' + (err?.message ?? 'Server error'));
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
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalContainer}>
            <ThemedText type="title" style={styles.modalTitle}>Login Required</ThemedText>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={COLORS.placeholder}
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                returnKeyType="next"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={COLORS.placeholder}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                returnKeyType="done"
                onSubmitEditing={login}
              />
            </View>

            <TouchableOpacity style={[styles.button, styles.loginButton]} activeOpacity={0.8} onPress={login}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} activeOpacity={0.8} onPress={() => setShowLoginModal(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
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

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 18,
    padding: 24,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    // Elevation for Android
    elevation: 6,
  },
  modalTitle: {
    marginBottom: 20,
    fontWeight: '700',
    fontSize: 23,
    color: COLORS.primary,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    marginBottom: 6,
    fontWeight: '500',
    fontSize: 14,
    color: COLORS.text,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    paddingHorizontal: 18,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: '#f5f7fa',
  },
  button: {
    borderRadius: 22,
    paddingVertical: 13,
    marginTop: 8,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButton: {
    backgroundColor: COLORS.cancelRed,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 1,
  },
  signupPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
    alignItems: 'center',
  },
  signupText: {
    color: COLORS.text,
    fontSize: 15,
  },
  signupLink: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '700',
    textDecorationLine: 'underline',
    marginLeft: 2,
  },
});

