// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { View, StyleSheet, Dimensions, ScrollView, TextInput, TouchableOpacity, Platform, Text, Button, Linking } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import ParallaxScrollView from '@/components/ParallaxScrollView';
// import { ThemedText } from '@/components/ThemedText';
// import { ThemedView } from '@/components/ThemedView';
// import { Headers } from '@/components/Headers';
// import { getData } from '@/helpers/expoSecureStore';
// import LoginForm from '@/components/LoginForm';
// import httpRequest from '@/helpers/httpRequests';
// import SignupForm from '@/components/SignupForm';
// import { CustomDropdown } from '@/components/CustomDropdown';
// import { CategoriesDropdown } from '@/components/CategoryDropdown';
// import { useFocusEffect } from '@react-navigation/native';
// import { launchImageLibrary } from 'react-native-image-picker';

// const screenHeight = Dimensions.get('window').height;

// export default function HomeScreen() {

//   const [isLogin, setIsLogin] = useState(false);
//   const [messages, setMessages] = useState<{ [key: number]: string }>({});
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [previousQuery, setPreviousQuery] = useState([]);
//   const [openVendorInsides, setOpenVendorInsides] = useState<Set<number>>(new Set());
//   const [showSignupModal, setShowSignupModal] = useState(false);
//   const [user, setUser] = useState({});

//   useFocusEffect(
//     useCallback(() => {
//       if (isLogin) {
//         getQuery()
//         fetchProfileData()
//       } else {
//         setPreviousQuery([])
//         setUser({})
//       }
//     }, [isLogin])
//   )

//   const getQuery = async() => {
//     const response:any = await httpRequest.get('api/v1/delivery-partner/get-query');
//     console.log("response:", response);
//     if (response.data.status === 200) {
//       setPreviousQuery(response.data.data);
//       response.data.data.map((_:any, index:number) => {
//         setOpenVendorInsides(prev => new Set(prev).add(index));
//       })
//     }
//   }

//   const fetchProfileData = async () => {
//     if (isLogin) {
//       const response: any = await httpRequest.get('api/v1/auth/profile');
//       if (response.data.status === 200) {
//         setUser(response.data.data);
//       }
//     }
//   };

//   const displayProducts = (i: number) => {
//     setOpenVendorInsides(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(i)) {
//         newSet.delete(i);
//       } else {
//         newSet.add(i);
//       }
//       return newSet;
//     });
//   };

//   const openSignupModal = () => {
//     setShowSignupModal(true);
//     setShowLoginModal(false);
//   }

//   const openLoginModal = () => {
//     setShowSignupModal(false);
//     setShowLoginModal(true);
//   }

//   const riderResponse = (type:string) => {
//     console.log("type:", type)
//   }

//   return (
//     <>
//       <LoginForm showLoginModal={showLoginModal} setShowLoginModal={setShowLoginModal} setIsLogin={setIsLogin} openSignupModal={openSignupModal} />
//       <SignupForm showSignupModal={showSignupModal} setShowSignupModal={setShowSignupModal} setIsLogin={setIsLogin} openLoginModal={openLoginModal} />
//       <ParallaxScrollView
//         headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
//         headerImage={<Headers isLogin={isLogin} setIsLogin={setIsLogin} user={user} />}
//       >
//         <ThemedView style={styles.mainContainer}>
//           <ThemedView style={[styles.previousQueryContainer, { height: screenHeight * 0.7 }]}>
//             <ScrollView contentContainerStyle={styles.scrollContent}>
//               {
//                 previousQuery?.map((_:any, i) => (
//                   <View key={i} style={styles.card}>
//                     <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
//                       <View>
//                         <ThemedText style={{ color: 'black' }} >No: {i + 1}</ThemedText>
//                         <ThemedText style={{ color: 'black' }} >Customer wants: {_.product}</ThemedText>
//                         <ThemedText style={{ color: 'black' }} >Category: {_.category}</ThemedText>
//                         <ThemedText style={{ color: 'black' }} >Quantity: {_.quantity}</ThemedText>
//                         <ThemedText style={{ color: 'black' }} >Status: {_.orderStatus}</ThemedText>
//                         {
//                           _.quantity === 0 || !_.product || !_.category ? (
//                             <ThemedText style={{ color: 'red' }} >Not a valid product</ThemedText>
//                           ) : ''
//                         }
//                       </View>
//                       <View>
//                         {
//                           _.User.Profiles.map((profile:any) => (
//                             profile.defaultAddress && (
//                               <TouchableOpacity
//                                 key={profile.id}
//                                 onPress={() => {
//                                   const destination = `${profile.lat},${profile.long}`;
//                                   const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
//                                   Linking.openURL(url);
//                                 }}
//                                 style={{
//                                   backgroundColor: '#007AFF',
//                                   padding: 10,
//                                   borderRadius: 6,
//                                   marginTop: 10,
//                                 }}
//                               >
//                                 <Text style={{ color: 'white', textAlign: 'center' }}>Navigate to Drop Location</Text>
//                               </TouchableOpacity>
//                             )
//                           ))
//                         }
//                       </View>
//                     </View>

//                     <TouchableOpacity onPress={() => displayProducts(i)}>{openVendorInsides.has(i) ? <ThemedText style={{ color: 'black' }}>View Less</ThemedText> : <ThemedText style={{ color: 'black' }}>View More</ThemedText>}</TouchableOpacity>
//                     {
//                       openVendorInsides.has(i) && (
//                         _?.VendorResponses.map((availableProduct:any, index:number) => (
//                           <View key={index} style={styles.card}>
//                             <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
//                               <View>
//                                 <ThemedText style={{ color: 'black' }}>No: {index + 1}</ThemedText>
//                                 <ThemedText style={{ color: 'black' }}>Price: {availableProduct.price}</ThemedText>
//                                 <ThemedText style={{ color: 'black' }}>Available quantity: {availableProduct.deliverable_quantity}</ThemedText>
//                                 <ThemedText style={{ color: 'black' }}>Payment Status: {availableProduct?.Payments?.paymentStatus}</ThemedText>
//                                 <ThemedText style={{ color: 'black' }}>Order ID: {availableProduct?.Payments?.razorpayOrderId}</ThemedText>
//                                 <ThemedText style={{ color: 'black' }}>Payment ID: {availableProduct?.Payments?.razorpayPaymentId}</ThemedText>
//                               </View>
//                               <View style={{flexDirection: 'row', gap: 20}}>
//                                 <TouchableOpacity onPress={() => riderResponse('accept')} style={[styles.buttons, {backgroundColor: 'rgb(0, 122, 255)'}]}>
//                                   <ThemedText>Accept</ThemedText>
//                                 </TouchableOpacity>
//                                 <TouchableOpacity onPress={() => riderResponse('reject')} style={[styles.buttons, {backgroundColor: 'red'}]}>
//                                   <ThemedText>Reject</ThemedText>
//                                 </TouchableOpacity>
//                               </View>
//                               <View>
//                                 <TouchableOpacity
//                                   key={availableProduct.id}
//                                   onPress={() => {
//                                     const destination = `${availableProduct?.vendor?.profile.lat},${availableProduct?.vendor?.profile.long}`;
//                                     const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
//                                     Linking.openURL(url);
//                                   }}
//                                   style={{
//                                     backgroundColor: '#007AFF',
//                                     padding: 10,
//                                     borderRadius: 6,
//                                     marginTop: 10,
//                                   }}
//                                 >
//                                   <Text style={{ color: 'white', textAlign: 'center' }}>Navigate to Pickup Location</Text>
//                                 </TouchableOpacity>
//                               </View>
//                             </View>
//                           </View>
//                         ))
//                       )
//                     }
//                   </View>
//                 ))
//               }
//             </ScrollView>
//           </ThemedView>
//         </ThemedView>
//       </ParallaxScrollView>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   mainContainer: {
//     flex: 1,
//     backgroundColor: '#f7f9fb', // soft light background
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingTop: 16,
//   },
//   previousQueryContainer: {
//     width: '100%',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 20,
//     paddingVertical: 16,
//     paddingHorizontal: 12,
//     marginTop: 16,
//     // soft shadow
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.06,
//     shadowRadius: 16,
//     elevation: 3,
//   },
//   scrollContent: {
//     paddingBottom: 16,
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 16,
//     marginVertical: 12,
//     marginHorizontal: 8,

//     // iOS shadow
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.08,
//     shadowRadius: 10,

//     // Android shadow
//     elevation: 5,
//   },
//   buttons: {
//     height: 40,
//     minWidth: 100,
//     borderRadius: 12,
//     marginTop: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 12,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//     borderTopWidth: 1,
//     borderColor: '#eaeaea',
//     borderRadius: 14,
//     width: '100%',
//   },
//   textInput: {
//     flex: 1,
//     fontSize: 16,
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderRadius: 26,
//     backgroundColor: '#f2f3f6',
//   },
//   sendButton: {
//     marginLeft: 14,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.42)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContainer: {
//     width: '88%',
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 26,
//     elevation: 12,
//     shadowColor: '#000',
//     shadowOpacity: 0.12,
//     shadowRadius: 14,
//     shadowOffset: { width: 0, height: 10 },
//   },
//   modalTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 14,
//     color: '#674ea7',
//     textAlign: 'center',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 12,
//     padding: 14,
//     marginBottom: 18,
//     width: '100%',
//     fontSize: 16,
//     backgroundColor: '#f5f5f5',
//   },
//   headerBtn: {
//     backgroundColor: '#674ea7',
//     borderRadius: 14,
//     paddingVertical: 14,
//     paddingHorizontal: 24,
//     marginRight: 14,
//   },
//   headerBtnText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 18,
//   },
//   reactLogo: {
//     height: 160,
//     width: 270,
//     bottom: 0,
//     left: 0,
//     position: 'absolute',
//   },
// });



import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Text, Linking } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Headers } from '@/components/Headers';
import { getData } from '@/helpers/expoSecureStore';
import LoginForm from '@/components/LoginForm';
import httpRequest from '@/helpers/httpRequests';
import SignupForm from '@/components/SignupForm';
import { CategoriesDropdown } from '@/components/CategoryDropdown';
import { useFocusEffect } from '@react-navigation/native';

const screenHeight = Dimensions.get('window').height;

export default function HomeScreen() {
  const [isLogin, setIsLogin] = useState(false);
  const [previousQuery, setPreviousQuery] = useState([]);
  const [openVendorInsides, setOpenVendorInsides] = useState(new Set());
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [user, setUser] = useState({});

  useFocusEffect(
    useCallback(() => {
      if (isLogin) {
        getQuery();
        fetchProfileData();
      } else {
        setPreviousQuery([]);
        setUser({});
      }
    }, [isLogin])
  );

  const getQuery = async () => {
    const response = await httpRequest.get('api/v1/delivery-partner/get-query');
    console.log("response:", response);
    if (response.data.status === 200) {
      setPreviousQuery(response.data.data);
      response.data.data.forEach((_:any, index:any) => {
        setOpenVendorInsides((prev) => new Set(prev).add(index));
      })
    }
  };

  const fetchProfileData = async () => {
    if (isLogin) {
      const response = await httpRequest.get('api/v1/auth/profile');
      if (response.data.status === 200) {
        setUser(response.data.data);
      }
    }
  };

  const displayProducts = (i) => {
    setOpenVendorInsides((prev) => {
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
  };

  const openLoginModal = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  };

  const riderResponse = (type:any) => {
    console.log("type:", type);
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
            <ScrollView contentContainerStyle={styles.scrollContent}>
              {
                previousQuery?.map((_:any, i:any) => (
                  <View key={i} style={styles.card}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <View>
                        <ThemedText style={{ color: 'black' }}>No: {i + 1}</ThemedText>
                        <ThemedText style={{ color: 'black' }}>Customer wants: {_.product}</ThemedText>
                        <ThemedText style={{ color: 'black' }}>Category: {_.category}</ThemedText>
                        <ThemedText style={{ color: 'black' }}>Quantity: {_.quantity}</ThemedText>
                        <ThemedText style={{ color: 'black' }}>Status: {_.orderStatus}</ThemedText>
                        {
                          _.quantity === 0 || !_.product || !_.category ? (
                            <ThemedText style={{ color: 'red' }}>Not a valid product</ThemedText>
                          ) : null
                        }
                      </View>
                      <View>
                        {
                          _.User.Profiles.map((profile:any) => (
                            profile.defaultAddress && (
                              <TouchableOpacity
                                key={profile.id}
                                onPress={() => {
                                  const destination = `${profile.lat},${profile.long}`;
                                  const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
                                  Linking.openURL(url);
                                }}
                                style={{
                                  backgroundColor: '#007AFF',
                                  padding: 10,
                                  borderRadius: 6,
                                  marginTop: 10,
                                }}
                              >
                                <Text style={{ color: 'white', textAlign: 'center' }}>Navigate to Drop Location</Text>
                              </TouchableOpacity>
                            )
                          ))
                        }
                      </View>
                    </View>

                    <TouchableOpacity onPress={() => displayProducts(i)}>
                      {openVendorInsides.has(i) ? (
                        <ThemedText style={{ color: 'black' }}>View Less</ThemedText>
                      ) : (
                        <ThemedText style={{ color: 'black' }}>View More</ThemedText>
                      )}
                    </TouchableOpacity>

                    {
                      openVendorInsides.has(i) && _.VendorResponses.map((availableProduct:any, index:ay) => (
                        <View key={index} style={styles.card}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View>
                              <ThemedText style={{ color: 'black' }}>No: {index + 1}</ThemedText>
                              <ThemedText style={{ color: 'black' }}>Price: {availableProduct.price}</ThemedText>
                              <ThemedText style={{ color: 'black' }}>Available quantity: {availableProduct.deliverable_quantity}</ThemedText>
                              <ThemedText style={{ color: 'black' }}>Payment Status: {availableProduct?.Payments?.paymentStatus}</ThemedText>
                              <ThemedText style={{ color: 'black' }}>Order ID: {availableProduct?.Payments?.razorpayOrderId}</ThemedText>
                              <ThemedText style={{ color: 'black' }}>Payment ID: {availableProduct?.Payments?.razorpayPaymentId}</ThemedText>
                            </View>
                            <View style={{
                              flexDirection: 'row',
                              flexWrap: 'wrap',
                              justifyContent: 'space-between',
                              flex: 1,
                              maxWidth: '40%',
                              marginLeft: 12,
                            }}>
                              <TouchableOpacity onPress={() => riderResponse('accept')} style={[styles.buttons, { backgroundColor: 'rgb(0, 122, 255)' }]}>
                                <ThemedText style={{ color: '#fff', textAlign: 'center' }}>Accept</ThemedText>
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => riderResponse('reject')} style={[styles.buttons, { backgroundColor: 'red' }]}>
                                <ThemedText style={{ color: '#fff', textAlign: 'center' }}>Reject</ThemedText>
                              </TouchableOpacity>
                            </View>
                            <View>
                              <TouchableOpacity
                                key={availableProduct.id}
                                onPress={() => {
                                  const destination = `${availableProduct?.vendor?.profile.lat},${availableProduct?.vendor?.profile.long}`;
                                  const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
                                  Linking.openURL(url);
                                }}
                                style={{
                                  backgroundColor: '#007AFF',
                                  padding: 10,
                                  borderRadius: 6,
                                  marginTop: 10,
                                }}
                              >
                                <Text style={{ color: 'white', textAlign: 'center' }}>Navigate to Pickup Location</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      ))
                    }
                  </View>
                ))
              }
            </ScrollView>
          </ThemedView>
        </ThemedView>
      </ParallaxScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // backgroundColor: '#f7f9fb',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  previousQueryContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 0,
    paddingHorizontal: 0,
    marginTop: 0,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
    marginHorizontal: 8,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,

    elevation: 5,
  },
  buttons: {
    height: 40,
    minWidth: 100,
    borderRadius: 12,
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#eaeaea',
    borderRadius: 14,
    width: '100%',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 26,
    backgroundColor: '#f2f3f6',
  },
  sendButton: {
    marginLeft: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.42)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '88%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 26,
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 14,
    color: '#674ea7',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
    width: '100%',
    fontSize: 16,
    backgroundColor: '#f5f5f5',
  },
  headerBtn: {
    backgroundColor: '#674ea7',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginRight: 14,
  },
  headerBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  reactLogo: {
    height: 160,
    width: 270,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
