import { saveToken } from '@/helpers/expoSecureStore';
import React, { useState } from 'react';
import { Modal, View, Text, Button, Platform, StyleSheet, Dimensions, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import httpRequest from '@/helpers/httpRequests';
import { ThemedText } from './ThemedText';

export default function AddAddressForm({ isAddressModalOpen, setIsAddressModalOpen, fetchProfileData }:any) {

  const [houseNumber, setHouseNumber] = useState();
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');

  const saveAddress = async() => {
    if (!houseNumber || !area || !city || !pinCode) {
      return;
    }
    const response: any = await httpRequest.post('api/v1/user/add-address', { houseNumber, area, city, pinCode });
    if (response.data.status === 200) {
      fetchProfileData();
      setIsAddressModalOpen(false);
    }
  }

  return (
    <>
      <Modal
        visible={isAddressModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddressModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Address:</Text>

            <TextInput placeholder="Flat/House no" style={styles.input} value={houseNumber} onChangeText={setHouseNumber} />
            <TextInput placeholder="Area" style={styles.input} value={area} onChangeText={setArea} />
            <TextInput placeholder="City" style={styles.input} value={city} onChangeText={setCity} />
            <TextInput placeholder="Area Pin Code" style={styles.input} value={pinCode} onChangeText={setPinCode} />
            <Button title="Submit" onPress={saveAddress} />
            <Button title="Cancel" color="red" onPress={() => setIsAddressModalOpen(false)} />
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

