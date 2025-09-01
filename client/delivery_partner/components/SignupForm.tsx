import { saveToken } from '@/helpers/expoSecureStore';
import React, { useState } from 'react';
import { Modal, View, Text, Button, Platform, StyleSheet, Dimensions, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import httpRequest from '@/helpers/httpRequests';
import { ThemedText } from './ThemedText';

// export default function SignupForm({ showSignupModal, setShowSignupModal, setIsLogin, openLoginModal }:any) {

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [name, setName] = useState('');
//   const [address, setAddress] = useState('');

//   const signup = async() => {
//     if (!email || !password || !name || !address) {
//       return;
//     }
//     const response:any = await httpRequest.post('api/v1/auth/create-account', { email, password, name, address, role: 'delivery_partner' });
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
//             <ThemedText style={{ color: 'black' }}>Already have account <TouchableOpacity onPress={openLoginModal}>Click here</TouchableOpacity></ThemedText>
//           </View>
//         </View>
//       </Modal>
//     </>
//   );
// }

export default function SignupForm({ showSignupModal, setShowSignupModal, setIsLogin, openLoginModal }:any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const signup = async () => {
    if (!email || !password || !name || !address) return;
    const response = await httpRequest.post('api/v1/auth/create-account', {
      email,
      password,
      name,
      address,
      role: 'delivery_partner',
    });
    if (response.data.status === 200) {
      const { message } = response.data;
      console.log('message:', message);
    }
    setShowSignupModal(false);
    openLoginModal();
  };

  return (
    <Modal
      visible={showSignupModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowSignupModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Signup</Text>

          <TextInput placeholder="Name" style={styles.input} value={name} onChangeText={setName} />
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
          <TextInput placeholder="Address" style={styles.input} value={address} onChangeText={setAddress} />

          <TouchableOpacity style={styles.primaryBtn} onPress={signup}>
            <Text style={styles.primaryBtnText}>Signup</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowSignupModal(false)}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <ThemedText style={{ color: '#333' }}>Already have an account? </ThemedText>
            <TouchableOpacity onPress={openLoginModal}>
              <Text style={styles.linkText}>Login here</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}


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
    padding: 28,
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#674ea7',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 18,
    backgroundColor: '#fafafa',
    fontSize: 16,
  },
  primaryBtn: {
    backgroundColor: '#674ea7',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 14,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelBtn: {
    backgroundColor: '#eee',
    borderRadius: 24,
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 12,
  },
  cancelBtnText: {
    color: '#674ea7',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  linkText: {
    color: '#007AFF',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 16,
  },
});


