import { saveData } from '@/helpers/expoSecureStore';
import React, { useState } from 'react';
import { Modal, View, Text, Button, Platform, StyleSheet, Dimensions, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import httpRequest from '@/helpers/httpRequests';
import { ThemedText } from './ThemedText';

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
//             <ThemedText style={{ color: 'black' }}>Dont have account <TouchableOpacity onPress={openSignupModal}>Click here</TouchableOpacity></ThemedText>
//           </View>
//         </View>
//       </Modal>
//     </>
//   );
// }

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
//   }
// })

export default function LoginForm({ showLoginModal, setShowLoginModal, setIsLogin, openSignupModal }:any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    if (!email || !password) return;
    const response = await httpRequest.post('api/v1/auth/login', { email, password });
    if (response.data.status === 200) {
      const { data } = response.data;
      saveData('token', data.token);
      setIsLogin(true);
      setShowLoginModal(false);
    }
  };

  return (
    <Modal
      visible={showLoginModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowLoginModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Login Required</Text>

          <TextInput
            placeholder="Email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            placeholder="Password"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.primaryBtn} onPress={login}>
            <Text style={styles.primaryBtnText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowLoginModal(false)}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>

          <View style={styles.signupRow}>
            <ThemedText style={{ color: '#333' }}>Don't have an account?</ThemedText>
            <TouchableOpacity onPress={openSignupModal}>
              <Text style={styles.linkText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}


const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.38)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '86%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 26,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#674ea7'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    backgroundColor: '#fafafa',
    fontSize: 16,
  },
  primaryBtn: {
    backgroundColor: '#674ea7',
    paddingVertical: 13,
    paddingHorizontal: 10,
    borderRadius: 22,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelBtn: {
    backgroundColor: '#eee',
    borderRadius: 22,
    alignItems: 'center',
    paddingVertical: 11,
    marginBottom: 12,
  },
  cancelBtnText: {
    color: '#674ea7',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  linkText: {
    color: '#674ea7',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 16,
  },
});
