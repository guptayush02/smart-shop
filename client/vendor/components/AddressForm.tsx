// import { saveToken } from '@/helpers/expoSecureStore';
// import React, { useState } from 'react';
// import { Modal, View, Text, Button, Platform, StyleSheet, Dimensions, ScrollView, TextInput, TouchableOpacity } from 'react-native';
// import httpRequest from '@/helpers/httpRequests';
// import { ThemedText } from './ThemedText';

// export default function AddAddressForm({ isAddressModalOpen, setIsAddressModalOpen, fetchProfileData }:any) {

//   const [houseNumber, setHouseNumber] = useState();
//   const [area, setArea] = useState('');
//   const [city, setCity] = useState('');
//   const [pinCode, setPinCode] = useState('');

//   const saveAddress = async() => {
//     if (!houseNumber || !area || !city || !pinCode) {
//       return;
//     }
//     const response: any = await httpRequest.post('api/v1/auth/add-address', { houseNumber, area, city, pinCode });
//     if (response.data.status === 200) {
//       fetchProfileData();
//       setIsAddressModalOpen(false);
//     }
//   }

//   return (
//     <>
//       <Modal
//         visible={isAddressModalOpen}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setIsAddressModalOpen(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <Text style={styles.modalTitle}>Add Address</Text>

//             <TextInput placeholder="Flat/House no" style={styles.input} value={houseNumber} onChangeText={setHouseNumber} />
//             <TextInput placeholder="Area" style={styles.input} value={area} onChangeText={setArea} />
//             <TextInput placeholder="City" style={styles.input} value={city} onChangeText={setCity} />
//             <TextInput placeholder="Area Pin Code" style={styles.input} value={pinCode} onChangeText={setPinCode} />
//             <Button title="Submit" onPress={saveAddress} />
//             <Button title="Cancel" color="red" onPress={() => setIsAddressModalOpen(false)} />
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
import httpRequest from '@/helpers/httpRequests';
import { ThemedText } from './ThemedText';

export default function AddAddressForm({ isAddressModalOpen, setIsAddressModalOpen, fetchProfileData }: any) {
  const [houseNumber, setHouseNumber] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');

  const saveAddress = async () => {
    if (!houseNumber.trim() || !area.trim() || !city.trim() || !pinCode.trim()) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return;
    }
    try {
      const response: any = await httpRequest.post('api/v1/auth/add-address', {
        houseNumber,
        area,
        city,
        pinCode,
      });
      if (response.data.status === 200) {
        fetchProfileData();
        setIsAddressModalOpen(false);
        // Reset all fields after successful submission
        setHouseNumber('');
        setArea('');
        setCity('');
        setPinCode('');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to save address');
      }
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'An error occurred while saving address');
    }
  };

  return (
    <Modal
      visible={isAddressModalOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsAddressModalOpen(false)}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        style={styles.modalOverlay}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalContainer}>
            <ThemedText type="title" style={styles.modalTitle}>Add Address</ThemedText>

            <TextInput
              placeholder="Flat/House no"
              keyboardType="default"
              style={styles.input}
              value={houseNumber}
              onChangeText={setHouseNumber}
              returnKeyType="next"
              autoCapitalize="words"
              placeholderTextColor="#888"
            />
            <TextInput
              placeholder="Area"
              keyboardType="default"
              style={styles.input}
              value={area}
              onChangeText={setArea}
              returnKeyType="next"
              autoCapitalize="words"
              placeholderTextColor="#888"
            />
            <TextInput
              placeholder="City"
              keyboardType="default"
              style={styles.input}
              value={city}
              onChangeText={setCity}
              returnKeyType="next"
              autoCapitalize="words"
              placeholderTextColor="#888"
            />
            <TextInput
              placeholder="Area Pin Code"
              keyboardType="numeric"
              style={styles.input}
              value={pinCode}
              onChangeText={setPinCode}
              returnKeyType="done"
              maxLength={10}
              placeholderTextColor="#888"
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={saveAddress} activeOpacity={0.8}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setIsAddressModalOpen(false)} activeOpacity={0.8}>
                <Text style={styles.buttonText}>Cancel</Text>
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
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#007AFF',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
});
