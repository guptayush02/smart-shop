import { saveToken } from '@/helpers/expoSecureStore';
import React, { useState } from 'react';
import { Modal, View, Text, Button, Platform, StyleSheet, Dimensions, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import httpRequest from '@/helpers/httpRequests';
import { ThemedText } from './ThemedText';

export default function CustomModal({ isModalOpen, setIsModalOpen, children }:any) {

  return (
    <>
      <Modal
        visible={isModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalOpen(false)}
      >
       {children}
       <View style={{width: '20%', alignSelf: 'center'}}>
       {/* <Button title="Cancel" color="red" onPress={() => setIsModalOpen(false)} /> */}
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

