import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Modal, View, Text, Button, Platform, StyleSheet, Dimensions, ScrollView, TextInput, TouchableOpacity, Animated, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Headers } from '@/components/Headers';
import { getToken } from '@/helpers/expoSecureStore';
import LoginForm from '@/components/LoginForm';
import httpRequest from '@/helpers/httpRequests';
import SignupForm from '@/components/SignupForm';
import { useFocusEffect } from '@react-navigation/native';
import Addresses from '@/components/Addresses';
import CustomModal from '@/components/CustomModal';
import AddAddressForm from '@/components/AddAddressForm';
import AnimatedInputBox from '@/components/AnimatedInputBox';

const screenHeight = Dimensions.get('window').height;

export default function HomeScreen() {
  const [isLogin, setIsLogin] = useState(false);
  const [message, setMessage] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [previousQuery, setPreviousQuery] = useState([]);
  const [openVendorIndices, setOpenVendorIndices] = useState<Set<number>>(new Set());
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<any>({});
  const [availableProductId, setAvailableProductId] = useState<number>();
  const [orderPlacedByUser, setOrderPlacedByUser] = useState<any>({});

  const keyboardHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const keyboardWillShow = (e:any) => {
      Animated.timing(keyboardHeight, {
        toValue: e.endCoordinates.height,
        duration: Platform.OS === 'ios' ? e.duration : 250,
        useNativeDriver: false,
      }).start();
    };

    const keyboardWillHide = (e:any) => {
      Animated.timing(keyboardHeight, {
        toValue: 0,
        duration: Platform.OS === 'ios' ? e.duration : 250,
        useNativeDriver: false,
      }).start();
    };

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showListener = Keyboard.addListener(showEvent, keyboardWillShow);
    const hideListener = Keyboard.addListener(hideEvent, keyboardWillHide);

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      const checkToken = async() => {
        const token = await getToken('token');
        if (token) {
          setIsLogin(true)
        } else {
          setIsLogin(false)
        }
      }
      checkToken()

      const getQuery = async() => {
        const response:any = await httpRequest.get('api/v1/user/get-pending-queries');
        if (response.data.status === 200) {
          setPreviousQuery(response.data.data);
        }
      }

      if (isLogin) {
        getQuery();
      } else {
        setPreviousQuery([]);
      }
    }, [isLogin])
  )

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

  const checkAddress = async(order: any) => {
    setIsModalOpen(true);
    setAvailableProductId(order?.id)
    setOrderPlacedByUser(order)
    return;
  }

  useEffect(() => {
    if (Platform.OS === 'web') {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    
      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  const paymentInitiate = async() => {
    const result:any = await httpRequest.post("api/v1/user/payment-initiate", { price: orderPlacedByUser.price });
    if (result.status === 200) {
      handleRazorpayPayment(result?.data?.data)
    }
  }

  const handleRazorpayPayment = async (order: any) => {
    const options = {
      key: "rzp_test_1Rp5t6vJdIGawV",
      amount: order.amount, // Amount in paisa (50000 = ₹500)
      currency: 'INR',
      name: 'Smart shop',
      description: 'Product Description',
      image: 'https://your-logo-url.com/logo.png',
      order_id: order?.id,
      handler: function (response:any) {
        buyNow(response)
      },
      prefill: {
        name: user?.name,
        email: user?.email,
        contact: '9999999999',
      },
      notes: {
        address: user?.Profiles.find((profile:any) => profile.defaultAddress),
      },
      theme: {
        color: '#007AFF',
      },
    };
  
    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };
  

  const buyNow = async(paymentDetails: any) => {
    const id = availableProductId;
    const token = await getToken('token');
    if (!token) {
      setShowLoginModal(true);
    } else {
      if (id) {
        const response:any = await httpRequest.post('api/v1/user/order-place', { vendorResponseId: id, orderStatus: "processing", razorpayPaymentId: paymentDetails?.razorpay_payment_id, razorpayOrderId: paymentDetails?.razorpay_order_id });
        if (response.data.status === 200) {
          setPreviousQuery(response.data.data);
          setMessage('');
          setIsModalOpen(false);
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return '#FFA500'; // orange
      case 'processing':
        return '#1E90FF'; // dodgerblue
      case 'shipped':
        return '#32CD32'; // limegreen
      case 'delivered':
        return '#008000'; // green
      case 'cancelled':
        return '#FF0000'; // red
      default:
        return '#000000'; // black default
    }
  };
  

  return (
    <>
      <CustomModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
        <View style={styles.addressModal}>
          <Addresses setIsAddressModalOpen={setIsAddressModalOpen} user={user} fetchProfileData={fetchProfileData} textColor={'black'} themeColor={'white'} />
          <View style={{alignItems: 'center'}}>
            {/* <Button title="Buy Now" color="blue" onPress={() => buyNow()} /> */}
            <Button title="Buy Now" color="blue" onPress={() => paymentInitiate()} />
            <Button title="Cancel" color="red" onPress={() => setIsModalOpen(false)} />
          </View>
        </View>
        <AddAddressForm isAddressModalOpen={isAddressModalOpen} setIsAddressModalOpen={setIsAddressModalOpen} fetchProfileData={fetchProfileData} />
      </CustomModal>
      <LoginForm showLoginModal={showLoginModal} setShowLoginModal={setShowLoginModal} setIsLogin={setIsLogin} openSignupModal={openSignupModal} />
      <SignupForm showSignupModal={showSignupModal} setShowSignupModal={setShowSignupModal} setIsLogin={setIsLogin} openLoginModal={openLoginModal} />
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={<Headers isLogin={isLogin} setIsLogin={setIsLogin} user={user} />}
      >
        <ThemedView style={styles.mainContainer}>
          <ThemedView style={[styles.previousQueryContainer, { height: screenHeight * 0.6 }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              {previousQuery?.map((item: any, i) => (
                <View key={i} style={styles.card}>
                  <ThemedText style={styles.cardText}>No: {i + 1}</ThemedText>
                  <ThemedText style={styles.cardText}>Product you ordered: {item.product}</ThemedText>
                  <ThemedText style={styles.cardText}>Category: {item.category}</ThemedText>
                  <ThemedText style={styles.cardText}>Quantity: {item.quantity}</ThemedText>
                  <ThemedText style={[styles.statusText, { color: getStatusColor(item.orderStatus) }]}>Status: {item.orderStatus}</ThemedText>
                  
                  {(item.quantity === 0 || !item.product || !item.category) && (
                    <ThemedText style={styles.invalidText}>Not a valid product</ThemedText>
                  )}
                  
                  <TouchableOpacity onPress={() => displayProducts(i)}>
                    <ThemedText style={styles.toggleLinkText}>
                      {openVendorIndices.has(i) ? 'View Less' : 'View Product'}
                    </ThemedText>
                  </TouchableOpacity>

                  {openVendorIndices.has(i) &&
                    item?.VendorResponses.map((availableProduct: any, index: number) => (
                      <View key={index} style={styles.card}>
                        <ThemedText style={styles.cardText}>No: {index + 1}</ThemedText>
                        <ThemedText style={styles.cardText}>Price: {availableProduct.price}</ThemedText>
                        <ThemedText style={styles.cardText}>Available quantity: {availableProduct.deliverable_quantity}</ThemedText>
                        <ThemedText style={styles.cardText}>Payment Status: {availableProduct?.Payment?.paymentStatus}</ThemedText>
                        {availableProduct?.Payment?.paymentStatus !== 'completed' && (
                          <Button style={styles.buyButton} title="Buy Now" onPress={() => checkAddress(availableProduct)} />
                        )}
                      </View>
                    ))
                  }
                </View>
              ))}
            </ScrollView>

          </ThemedView>

          {/* <ThemedView style={styles.inputContainer}>
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
          </ThemedView> */}
          <AnimatedInputBox message={message} setMessage={setMessage} handleSend={handleSend} />


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
    zIndex: 1
  },
  previousQueryContainer: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
  },
  scrollContent: {
    // paddingBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    borderRadius: 30,
    marginHorizontal: 16,
    marginBottom: 12,
    // Shadow (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Elevation (Android)
    elevation: 3
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    color: '#333',
  },
  sendButton: {
    // marginLeft: 10,
    marginLeft: 12,
    padding: 12, // bigger touch area
    backgroundColor: '#007AFF',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
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
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    // Shadows for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Shadows for Android
    elevation: 3,
  },
  addressModal: {
    width: '60%',
    marginTop: '20%',
    alignSelf: 'center',
    gap: 20,
    padding: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  cardText: {
    color: '#222',
    fontSize: 15,
    marginBottom: 6,
    lineHeight: 22,
  },
  statusText: {
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 6,
  },
  invalidText: {
    color: 'red',
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 8,
  },
  toggleLinkText: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 15,
    textDecorationLine: 'underline',
    marginVertical: 6,

  }
})
