import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Button, Platform, StyleSheet, Dimensions, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Headers } from '@/components/Headers';
import { getToken } from '@/helpers/expoSecureStore';
import LoginForm from '@/components/LoginForm';
import httpRequest from '@/helpers/httpRequests';
import SignupForm from '@/components/SignupForm';

const screenHeight = Dimensions.get('window').height;

export default function HomeScreen() {
  const [isLogin, setIsLogin] = useState(false);
  const [message, setMessage] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [previousQuery, setPreviousQuery] = useState([]);
  const [openVendorIndices, setOpenVendorIndices] = useState<Set<number>>(new Set());
  const [showSignupModal, setShowSignupModal] = useState(false);

  useEffect(() => {
    const getQuery = async() => {
      const response:any = await httpRequest.get('api/v1/user/get-pending-queries');
      if (response.data.status === 200) {
        setPreviousQuery(response.data.data);
      }
    }
    if (isLogin) {
      getQuery()
    } else {
      setPreviousQuery([])
    }
  }, [isLogin]);

  const handleSend = async () => {
    const token = await getToken('token');
    if (!token) {
      setShowLoginModal(true);
    } else {
      if (message) {
        const response:any = await httpRequest.post('api/v1/user/send-query', { query: message });
        if (response.data.status === 200) {
          setPreviousQuery(response.data.data);
          setMessage('');
        }
      }
    }
  };

  const displayProducts = (i: number) => {
    setOpenVendorIndices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(i)) {
        newSet.delete(i);
      } else {
        newSet.add(i);
      }
      return newSet;
    });
  };

  const buyNow = async(id: number) => {
    console.log("Buy now")
    const token = await getToken('token');
    if (!token) {
      setShowLoginModal(true);
    } else {
      if (id) {
        const response:any = await httpRequest.post('api/v1/user/order-place', { vendorResponseId: id, orderStatus: "processing" });
        if (response.data.status === 200) {
          setPreviousQuery(response.data.data);
          setMessage('');
        }
      }
    }
  }

  const openSignupModal = () => {
    setShowSignupModal(true);
    setShowLoginModal(false);
  }

  const openLoginModal = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  }

  return (
    <>
      <LoginForm showLoginModal={showLoginModal} setShowLoginModal={setShowLoginModal} setIsLogin={setIsLogin} openSignupModal={openSignupModal} />
      <SignupForm showSignupModal={showSignupModal} setShowSignupModal={setShowSignupModal} setIsLogin={setIsLogin} openLoginModal={openLoginModal} />
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={<Headers isLogin={isLogin} setIsLogin={setIsLogin} />}
      >
        <ThemedView style={styles.mainContainer}>
          <ThemedView style={[styles.previousQueryContainer, { height: screenHeight * 0.7 }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              {
                previousQuery?.map((_:any, i) => (
                  <View key={i} style={styles.card}>
                    <ThemedText style={{ color: 'black' }} >No: {i + 1}</ThemedText>
                    <ThemedText style={{ color: 'black' }} >Product you ordered: {_.product}</ThemedText>
                    <ThemedText style={{ color: 'black' }} >Category: {_.category}</ThemedText>
                    <ThemedText style={{ color: 'black' }} >Quantity: {_.quantity}</ThemedText>
                    <ThemedText style={{ color: 'black' }} >Status: {_.orderStatus}</ThemedText>
                    {
                      _.quantity === 0 || !_.product || !_.category ? (
                        <ThemedText style={{ color: 'red' }} >Not a valid product</ThemedText>
                      ) : ''
                    }
                    <TouchableOpacity onPress={() => displayProducts(i)}>{openVendorIndices.has(i) ? <ThemedText style={{ color: 'black' }}>View Less</ThemedText> : <ThemedText style={{ color: 'black' }}>View Product</ThemedText>}</TouchableOpacity>
                    {
                      openVendorIndices.has(i) && (
                        _?.VendorResponses.map((availableProduct:any, index:number) => (
                          <View key={index} style={styles.card}>
                            <ThemedText style={{ color: 'black' }}>No: {index + 1}</ThemedText>
                            <ThemedText style={{ color: 'black' }}>Price: {availableProduct.price}</ThemedText>
                            <ThemedText style={{ color: 'black' }}>Available quantity: {availableProduct.deliverable_quantity}</ThemedText>
                            <ThemedText style={{ color: 'black' }}>Payment Status: {availableProduct?.Payment?.paymentStatus}</ThemedText>
                            {
                              _.orderStatus === 'pending' && (
                                <Button style={styles.buyButton} title="Buy Now" onPress={() => buyNow(availableProduct?.id)} />
                              )
                            }
                          </View>
                        ))
                      )
                    }
                  </View>
                ))
              }
            </ScrollView>
          </ThemedView>

          <ThemedView style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Want to buy anything..."
              value={message}
              onChangeText={setMessage}
              onSubmitEditing={handleSend}
              returnKeyType="send"
            />
            <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
              <Ionicons name="arrow-up-circle" size={28} color="#007AFF" />
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </ParallaxScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  previousQueryContainer: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
  },
  scrollContent: {
    paddingBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    width: '100%'
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f2f2f2',
  },
  sendButton: {
    marginLeft: 10,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
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
  },
  card: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
    // ✅ Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // ✅ Shadow for Android
    elevation: 4,
  }
})

