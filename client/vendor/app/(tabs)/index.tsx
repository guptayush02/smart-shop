import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, TextInput, TouchableOpacity, Platform, Text, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Headers } from '@/components/Headers';
import { getData } from '@/helpers/expoSecureStore';
import LoginForm from '@/components/LoginForm';
import httpRequest from '@/helpers/httpRequests';
import SignupForm from '@/components/SignupForm';
import { CustomDropdown } from '@/components/CustomDropdown';
import { CategoriesDropdown } from '@/components/CategoryDropdown';
import { useFocusEffect } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';

const screenHeight = Dimensions.get('window').height;

export default function HomeScreen() {

  const [isLogin, setIsLogin] = useState(false);
  const [messages, setMessages] = useState<{ [key: number]: string }>({});
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [previousQuery, setPreviousQuery] = useState([]);
  const [openVendorIndices, setOpenVendorIndices] = useState<Set<number>>(new Set());
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [user, setUser] = useState({});

  useFocusEffect(
    useCallback(() => {
      const checkToken = async() => {
        const token:any = await getData('token');
        if (token) {
          setIsLogin(true)
        } else {
          setIsLogin(false)
        }
      }
      checkToken()

      if (isLogin) {
        getQuery()
      } else {
        setPreviousQuery([])
      }
    }, [isLogin])
  )

  const getQuery = async() => {
    const category = await getData('category')
    const orderStatus = 'pending'
    const response:any = await httpRequest.get(`api/v1/vendor/get-vendor-query?category=${category}&orderStatus=${orderStatus}`);
    if (response.data.status === 200) {
      setPreviousQuery(response.data.data);
    }
  }

  const handleSend = async (orderId: number, i: number) => {
    const [token, category] = await Promise.all([getData('token'), getData('category')]);
    const message = messages[orderId];
    if (!token) {
      setShowLoginModal(true);
    } else {
      if (messages) {
        const response:any = await httpRequest.post('api/v1/vendor/vendor-query-response', { query: message, orderId, category });
        if (response.data.status === 200) {
          setPreviousQuery(response.data.data);
          setMessages(prev => ({ ...prev, [orderId]: '' }));
        }
      }
    }
    displayProducts(i)
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

  const openSignupModal = () => {
    setShowSignupModal(true);
    setShowLoginModal(false);
  }

  const openLoginModal = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  }

  useFocusEffect(
    useCallback(() => {
      fetchProfileData();
    }, [isLogin])
  );

  const fetchProfileData = async () => {
    if (isLogin) {
      const response: any = await httpRequest.get('api/v1/auth/profile');
      if (response.data.status === 200) {
        setUser(response.data.data);
      }
    }
  };

  return (
    <>
      <LoginForm showLoginModal={showLoginModal} setShowLoginModal={setShowLoginModal} setIsLogin={setIsLogin} openSignupModal={openSignupModal} />
      <SignupForm showSignupModal={showSignupModal} setShowSignupModal={setShowSignupModal} setIsLogin={setIsLogin} openLoginModal={openLoginModal} />
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={<Headers isLogin={isLogin} setIsLogin={setIsLogin} user={user} />}
      >
        <ThemedView style={styles.mainContainer}>
          <ThemedView style={[styles.previousQueryContainer, { height: screenHeight * 0.7 }]}>
            <View style={{ position: 'relative', zIndex: 999 }}>
              <CategoriesDropdown isLogin={isLogin} getQuery={getQuery} />
            </View>
            {/* <ScrollView contentContainerStyle={styles.scrollContent}>
              {
                previousQuery?.map((_:any, i) => (
                  <View key={i} style={styles.card}>
                    <ThemedText style={{ color: 'black' }} >No: {i + 1}</ThemedText>
                    <ThemedText style={{ color: 'black' }} >Customer wants: {_.product}</ThemedText>
                    <ThemedText style={{ color: 'black' }} >Category: {_.category}</ThemedText>
                    <ThemedText style={{ color: 'black' }} >Quantity: {_.quantity}</ThemedText>
                    <ThemedText style={{ color: 'black' }} >Status: {_.orderStatus}</ThemedText>
                    {
                      _.quantity === 0 || !_.product || !_.category ? (
                        <ThemedText style={{ color: 'red' }} >Not a valid product</ThemedText>
                      ) : ''
                    }

                    <TouchableOpacity onPress={() => displayProducts(i)}>{openVendorIndices.has(i) ? <ThemedText style={{ color: 'black' }}>View Less</ThemedText> : <ThemedText style={{ color: 'black' }}>View More</ThemedText>}</TouchableOpacity>
                    {
                      openVendorIndices.has(i) && (
                        _?.VendorResponses.map((availableProduct:any, index:number) => (
                          <View key={index} style={styles.card}>
                            <ThemedText style={{ color: 'black' }}>No: {index + 1}</ThemedText>
                            <ThemedText style={{ color: 'black' }}>Price: {availableProduct.price}</ThemedText>
                            <ThemedText style={{ color: 'black' }}>Available quantity: {availableProduct.deliverable_quantity}</ThemedText>
                            <ThemedText style={{ color: 'black' }}>Payment Status: {availableProduct?.Payments?.paymentStatus}</ThemedText>
                            <ThemedText style={{ color: 'black' }}>Order ID: {availableProduct?.Payments?.razorpayOrderId}</ThemedText>
                            <ThemedText style={{ color: 'black' }}>Payment ID: {availableProduct?.Payments?.razorpayPaymentId}</ThemedText>
                          </View>
                        ))
                      )
                    }
                    <ThemedView style={styles.inputContainer}>
                      <TextInput
                        style={styles.textInput}
                        placeholder="Want to buy anything..."
                        value={messages[_?.id] || ''}
                        onChangeText={(text:any) => setMessages(prev => ({ ...prev, [_?.id]: text }))}
                        onSubmitEditing={() => handleSend(_?.id)}
                        returnKeyType="send"
                      />

                      <TouchableOpacity onPress={() => console.log(_?.id)} style={styles.sendButton}>
                        <Ionicons name="attach-outline" size={28} color="#007AFF" />
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => handleSend(_?.id)} style={styles.sendButton}>
                        <Ionicons name="arrow-up-circle" size={28} color="#007AFF" />
                      </TouchableOpacity>
                    </ThemedView>
                  </View>
                ))
              }
            </ScrollView> */}
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
              {previousQuery?.map((item: any, i) => (
                <View key={i} style={styles.card}>
                  <ThemedText style={styles.cardTitle}>No: {i + 1}</ThemedText>

                  <ThemedText style={styles.cardText}>Customer wants: {item.product}</ThemedText>
                  <ThemedText style={styles.cardText}>Category: {item.category}</ThemedText>
                  <ThemedText style={styles.cardText}>Quantity: {item.quantity}</ThemedText>
                  <ThemedText style={styles.statusText}>Status: {item.orderStatus}</ThemedText>

                  {item.quantity === 0 || !item.product || !item.category ? (
                    <ThemedText style={styles.invalidText}>Not a valid product</ThemedText>
                  ) : null}

                  <TouchableOpacity onPress={() => displayProducts(i)} activeOpacity={0.7}>
                    <ThemedText style={styles.toggleLink}>
                      {openVendorIndices.has(i) ? 'View Less' : 'View More'}
                    </ThemedText>
                  </TouchableOpacity>

                  {openVendorIndices.has(i) &&
                    item?.VendorResponses?.map((availableProduct: any, index: number) => (
                      <View key={index} style={styles.subCard}>
                        <ThemedText style={styles.subCardTitle}>No: {index + 1}</ThemedText>
                        <ThemedText style={styles.cardText}>Price: {availableProduct.price}</ThemedText>
                        <ThemedText style={styles.cardText}>Available quantity: {availableProduct.deliverable_quantity}</ThemedText>
                        <ThemedText style={styles.cardText}>Payment Status: {availableProduct?.Payments?.paymentStatus}</ThemedText>
                        <ThemedText style={styles.cardText}>Order ID: {availableProduct?.Payments?.razorpayOrderId}</ThemedText>
                        <ThemedText style={styles.cardText}>Payment ID: {availableProduct?.Payments?.razorpayPaymentId}</ThemedText>
                      </View>
                    ))}

                  <ThemedView style={styles.inputContainer}>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Want to buy anything..."
                      value={messages[item?.id] || ''}
                      onChangeText={(text: string) => setMessages((prev) => ({ ...prev, [item?.id]: text }))}
                      onSubmitEditing={() => handleSend(item?.id, i)}
                      returnKeyType="send"
                      placeholderTextColor="#999"
                    />

                    <TouchableOpacity onPress={() => console.log(item?.id)} style={styles.iconButton} activeOpacity={0.7}>
                      <Ionicons name="attach-outline" size={26} color="#007AFF" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleSend(item?.id, i)} style={styles.iconButton} activeOpacity={0.7}>
                      <Ionicons name="arrow-up-circle" size={28} color="#007AFF" />
                    </TouchableOpacity>
                  </ThemedView>
                </View>
              ))}
            </ScrollView>
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
    padding: 10
  },
  // scrollContent: {
  //   paddingBottom: 10,
  // },
  // inputContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   backgroundColor: '#fff',
  //   paddingHorizontal: 10,
  //   paddingVertical: 8,
  //   borderTopWidth: 1,
  //   borderColor: '#ccc',
  //   borderRadius: 8,
  //   width: '100%'
  // },
  // textInput: {
  //   flex: 1,
  //   fontSize: 16,
  //   paddingVertical: 8,
  //   paddingHorizontal: 12,
  //   borderRadius: 20,
  //   backgroundColor: '#f2f2f2',
  // },
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
  // card: {
  //   backgroundColor: '#fff',
  //   borderColor: '#ccc',
  //   borderWidth: 1,
  //   borderRadius: 10,
  //   padding: 12,
  //   marginVertical: 8,
  //   // ✅ Shadow for iOS
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 4,
  //   // ✅ Shadow for Android
  //   elevation: 4,
  // },
  scrollContent: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    // shadows for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    // elevation for Android
    elevation: 5,
  },
  subCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 14,
    marginVertical: 8,
    marginLeft: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    color: '#222',
  },
  subCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
    color: '#444',
  },
  cardText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  statusText: {
    fontWeight: '700',
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 8,
  },
  invalidText: {
    color: 'red',
    fontWeight: '700',
    marginBottom: 10,
    fontSize: 13,
  },
  toggleLink: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 14,
    textDecorationLine: 'underline',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    borderRadius: 22,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#333',
  },
  iconButton: {
    paddingHorizontal: 10,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
