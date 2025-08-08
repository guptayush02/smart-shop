// import { saveToken } from '@/helpers/expoSecureStore';
// import React, { useState } from 'react';
// import { Modal, View, Text, Button, Platform, StyleSheet, Dimensions, ScrollView, TextInput, TouchableOpacity } from 'react-native';
// import httpRequest from '@/helpers/httpRequests';
// import { ThemedText } from './ThemedText';

// export default function SignupForm({ showSignupModal, setShowSignupModal, setIsLogin, openLoginModal }:any) {

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [name, setName] = useState('');
//   const [address, setAddress] = useState('');

//   const signup = async() => {
//     if (!email || !password || !name || !address) {
//       return;
//     }
//     const response:any = await httpRequest.post('api/v1/auth/create-account', { email, password, name, address, role: 'vendor' });
//     if (response.data.status === 200) {
//       const { message } = response.data;
//       console.log("message:", message)
//     }
//     setShowSignupModal(false);
//     openLoginModal();
//   }

//   return (
//     <>
//       <Modal
//         visible={showSignupModal}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setShowSignupModal(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <Text style={styles.modalTitle}>Signup</Text>

//             <TextInput placeholder="Name" style={styles.input} value={name} onChangeText={setName} />
//             <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} />
//             <TextInput placeholder="Password" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
//             <TextInput placeholder="Address" style={styles.input} value={address} onChangeText={setAddress} />
//             <Button title="Signup" onPress={signup} />
//             <Button title="Cancel" color="red" onPress={() => setShowSignupModal(false)} />
//             {/* <ThemedText style={{ color: 'black' }}>Already have account <TouchableOpacity onPress={openLoginModal}>Click here</TouchableOpacity></ThemedText> */}
//             <View style={styles.signupPrompt}>
//               <Text style={styles.signupText}>Already have account </Text>
//               <TouchableOpacity onPress={openLoginModal} activeOpacity={0.7}>
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
  Alert,
} from 'react-native';
import { ThemedText } from './ThemedText';
import httpRequest from '@/helpers/httpRequests';
import { saveToken } from '@/helpers/expoSecureStore';

const COLORS = {
  primary: '#007AFF',
  background: '#fff',
  text: '#222',
  placeholder: '#999',
  cancelRed: '#FF3B30',
};

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
      Alert.alert('Error', 'Please fill all fields!');
      return;
    }
    try {
      const response: any = await httpRequest.post('api/v1/auth/create-account', {
        email,
        password,
        name,
        address,
        role: 'vendor', // or 'user' as per your logic needs
      });
      if (response.data.status === 200) {
        // You may want to auto-login here, or just open the login modal.
        Alert.alert('Signup Successful', response.data.message || 'Account created. Now log in!');
      } else {
        Alert.alert('Signup Failed', response.data.message || 'Something went wrong!');
      }
      setShowSignupModal(false);
      openLoginModal();
      setEmail('');
      setPassword('');
      setName('');
      setAddress('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Signup error');
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
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalContainer}>
            <ThemedText type="title" style={styles.modalTitle}>Signup</ThemedText>
            
            {/* Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
                returnKeyType="next"
                autoCapitalize="words"
                placeholderTextColor={COLORS.placeholder}
              />
            </View>
            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                placeholderTextColor={COLORS.placeholder}
              />
            </View>
            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                returnKeyType="next"
                placeholderTextColor={COLORS.placeholder}
              />
            </View>
            {/* Address */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your address"
                value={address}
                onChangeText={setAddress}
                returnKeyType="done"
                onSubmitEditing={signup}
                placeholderTextColor={COLORS.placeholder}
              />
            </View>

            <TouchableOpacity style={[styles.button, styles.signupButton]} onPress={signup} activeOpacity={0.8}>
              <Text style={styles.buttonText}>Signup</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setShowSignupModal(false)} activeOpacity={0.8}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <View style={styles.signupPrompt}>
              <Text style={styles.signupText}>Already have an account? </Text>
              <TouchableOpacity onPress={openLoginModal} activeOpacity={0.7}>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 6,
  },
  modalTitle: {
    marginBottom: 18,
    fontWeight: '700',
    fontSize: 23,
    color: COLORS.primary,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 13,
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
    borderRadius: 12,
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
  signupButton: {
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

