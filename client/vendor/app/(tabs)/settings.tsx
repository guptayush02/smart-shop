// import { useEffect, useState, useCallback } from 'react';
// import { Image } from 'expo-image';
// import { Platform, StyleSheet, View, TouchableOpacity, ScrollView, Text } from 'react-native';
// import { useFocusEffect } from '@react-navigation/native';
// import { Collapsible } from '@/components/Collapsible';
// import { ExternalLink } from '@/components/ExternalLink';
// import ParallaxScrollView from '@/components/ParallaxScrollView';
// import { ThemedText } from '@/components/ThemedText';
// import { ThemedView } from '@/components/ThemedView';
// import { IconSymbol } from '@/components/ui/IconSymbol';
// import { Headers } from '@/components/Headers';
// import httpRequest from '@/helpers/httpRequests';
// import AddAddressForm from '@/components/AddressForm';
// import Addresses from '@/components/Addresses';
// import { CategoriesDropdown } from '@/components/CategoryDropdown';
// import { getData, removeData } from '@/helpers/expoSecureStore';

// export default function TabTwoScreen() {
//   const [isLogin, setIsLogin] = useState(false);
//   const [user, setUser] = useState<any>({});
//   const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
//   const [paymentDetails, setPaymentDetails] = useState<any>([]);

//   useFocusEffect(
//     useCallback(() => {
//       const checkToken = async() => {
//         const token:any = await getData('token');
//         console.log("token:", token)
//         if (token) {
//           setIsLogin(true)
//         } else {
//           setIsLogin(false)
//         }
//       }
//       checkToken()

//       fetchProfileData();
//       fetchPaymentsDetails();
//     }, [isLogin])
//   );

//   const fetchPaymentsDetails = async() => {
//     if(isLogin) {
//       const paymentStatus = '';
//       const response:any = await httpRequest.get(`api/v1/vendor/payment-details?paymentStatus=${paymentStatus}`);
//       if (response.status === 200) {
//         console.log("response.data.data:", response.data.data)
//         setPaymentDetails(response.data.data);
//       }
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

//   const logout = async() => {
//     console.log("remove token")
//     await removeData('token');
//     setIsLogin(false);
//   };

//   return (
//     <ParallaxScrollView
//       headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
//       headerImage={
//         <Headers isLogin={isLogin} setIsLogin={setIsLogin} user={user} />
//       }>
//         <AddAddressForm isAddressModalOpen={isAddressModalOpen} setIsAddressModalOpen={setIsAddressModalOpen} fetchProfileData={fetchProfileData} />
//         <ThemedView style={styles.titleContainer}>
//           <ThemedText type="title">Settings</ThemedText>
//         </ThemedView>
//         {
//           isLogin ? (
//             <ThemedView style={styles.contentContainer}>
//               <View>
//                 <ThemedText>{user?.name}</ThemedText>
//                 <ThemedText>{user?.email}</ThemedText>
//               </View>
//               <View style={{ position: 'relative', zIndex: 999, gap: 8 }}>
//                 <ThemedText type="title">Category</ThemedText>
//                 <CategoriesDropdown isLogin={isLogin} getQuery={() => {}} />
//               </View>
//               <Addresses setIsAddressModalOpen={setIsAddressModalOpen} user={user} fetchProfileData={fetchProfileData} textColor={'black'} />

//               <ThemedView style={{ position: 'relative', zIndex: 999, gap: 8 }}>
//                 <ThemedText>Total Earnings: {paymentDetails.totalPaid}rs</ThemedText>
//                 <ScrollView horizontal>
//                   <View style={styles.table}>
//                     {/* Header Row */}
//                     <View style={[styles.row, styles.headerRow]}>
//                     <Text style={styles.headerCell}>Order ID</Text>
//                       <Text style={styles.headerCell}>SS Order ID</Text>
//                       <Text style={styles.headerCell}>Amount</Text>
//                       <Text style={styles.headerCell}>Currency</Text>
//                       <Text style={styles.headerCell}>Status</Text>
//                       <Text style={styles.headerCell}>PaymentID</Text>
//                     </View>

//                     {/* Data Rows */}
//                     {paymentDetails?.vendorPayments?.length && paymentDetails?.vendorPayments.map((payment:any, index:number) => (
//                       <View key={index} style={styles.row}>
//                         <Text style={styles.cell}>{payment?.razorpayOrderId}</Text>
//                         <Text style={styles.cell}>{payment?.orderId}</Text>
//                         <Text style={styles.cell}>{payment?.price}</Text>
//                         <Text style={styles.cell}>{payment?.currency}</Text>
//                         <Text style={styles.cell}>{payment?.paymentStatus}</Text>
//                         <Text style={styles.cell}>{payment?.razorpayPaymentId}</Text>
//                       </View>
//                     ))}
//                   </View>
//                 </ScrollView>
//                 <TouchableOpacity onPress={logout} style={styles.logoutButton} activeOpacity={0.7}>
//                   <ThemedText style={styles.logoutButtonText}>Logout</ThemedText>
//                 </TouchableOpacity>
//               </ThemedView>
//             </ThemedView>
//           ) : (
//             <ThemedText>You are not login</ThemedText>
//           )
//         }
//     </ParallaxScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   headerImage: {
//     color: '#808080',
//     bottom: -90,
//     left: -35,
//     position: 'absolute',
//   },
//   titleContainer: {
//     flexDirection: 'row',
//     gap: 8,
//   },
//   contentContainer: {
//     display: 'flex',
//     gap: 30,
//     height: 'auto'
//   },
//   table: {
//     marginVertical: 10,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//   },
//   row: {
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   headerRow: {
//     backgroundColor: '#f0f0f0',
//   },
//   cell: {
//     padding: 10,
//     minWidth: 200,
//     textAlign: 'center',
//     color: 'white'
//   },
//   headerCell: {
//     padding: 10,
//     minWidth: 200,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   logoutButton: {
//     backgroundColor: '#007AFF',
//     paddingVertical: 14,
//     paddingHorizontal: 24,
//     borderRadius: 24,
//     alignSelf: 'center',
//     marginTop: 20,
//     minWidth: 140,
//   },
//   logoutButtonText: {
//     color: 'white',
//     fontWeight: '700',
//     fontSize: 18,
//     textAlign: 'center',
//   },
// });

import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Headers } from '@/components/Headers';
import httpRequest from '@/helpers/httpRequests';
import AddAddressForm from '@/components/AddressForm';
import Addresses from '@/components/Addresses';
import { CategoriesDropdown } from '@/components/CategoryDropdown';
import { getData, removeData } from '@/helpers/expoSecureStore';

export default function TabTwoScreen() {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState<any>({});
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>({ vendorPayments: [], totalPaid: 0 });

  useFocusEffect(
    useCallback(() => {
      const checkToken = async () => {
        const token: any = await getData('token');
        if (token) {
          setIsLogin(true);
        } else {
          setIsLogin(false);
        }
      };
      checkToken();

      fetchProfileData();
      fetchPaymentsDetails();
    }, [isLogin])
  );

  const fetchPaymentsDetails = async () => {
    if (isLogin) {
      const paymentStatus = '';
      const response: any = await httpRequest.get(`api/v1/vendor/payment-details?paymentStatus=${paymentStatus}`);
      if (response.status === 200) {
        setPaymentDetails(response.data.data);
      }
    }
  };

  const fetchProfileData = async () => {
    if (isLogin) {
      const response: any = await httpRequest.get('api/v1/auth/profile');
      if (response.data.status === 200) {
        setUser(response.data.data);
      }
    }
  };

  const logout = async () => {
    await removeData('token');
    setIsLogin(false);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={<Headers isLogin={isLogin} setIsLogin={setIsLogin} user={user} />}
    >
      <AddAddressForm
        isAddressModalOpen={isAddressModalOpen}
        setIsAddressModalOpen={setIsAddressModalOpen}
        fetchProfileData={fetchProfileData}
      />
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.titleText}>Settings</ThemedText>
      </ThemedView>
      {isLogin ? (
        <ThemedView style={styles.contentContainer}>
          <View style={styles.userInfo}>
            <ThemedText style={styles.userName}>{user?.name}</ThemedText>
            <ThemedText style={styles.userEmail}>{user?.email}</ThemedText>
          </View>
          <View style={styles.categoryContainer}>
            <ThemedText type="title" style={styles.sectionTitle}>Category</ThemedText>
            <CategoriesDropdown isLogin={isLogin} getQuery={() => {}} />
          </View>
          <Addresses
            setIsAddressModalOpen={setIsAddressModalOpen}
            user={user}
            fetchProfileData={fetchProfileData}
            textColor="black"
          />

          <ThemedView style={styles.earningsContainer}>
            <ThemedText style={styles.earningsText}>Total Earnings: {paymentDetails.totalPaid ?? 0} rs</ThemedText>
            <ThemedView style={styles.paymentListContainer}>
              {paymentDetails?.vendorPayments?.length > 0 ? (
                paymentDetails.vendorPayments.map((payment: any, index: number) => (
                  <View key={index} style={styles.paymentCard}>
                    <Text style={styles.paymentField}><Text style={styles.fieldLabel}>Order ID:</Text> {payment.razorpayOrderId ?? '-'}</Text>
                    <Text style={styles.paymentField}><Text style={styles.fieldLabel}>SS Order ID:</Text> {payment.orderId ?? '-'}</Text>
                    <Text style={styles.paymentField}><Text style={styles.fieldLabel}>Amount:</Text> {payment.price ?? '-'}</Text>
                    <Text style={styles.paymentField}><Text style={styles.fieldLabel}>Currency:</Text> {payment.currency ?? '-'}</Text>
                    <Text style={styles.paymentField}><Text style={styles.fieldLabel}>Status:</Text> {payment.paymentStatus ?? '-'}</Text>
                    <Text style={styles.paymentField}><Text style={styles.fieldLabel}>Payment ID:</Text> {payment.razorpayPaymentId ?? '-'}</Text>
                  </View>
                ))
              ) : (
                <ThemedText style={styles.noDataText}>No payment data available</ThemedText>
              )}
            </ThemedView>

            {/* <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tableScrollView}>
              <View style={styles.table}>
                <View style={[styles.row, styles.headerRow]}>
                  <Text style={styles.headerCell}>Order ID</Text>
                  <Text style={styles.headerCell}>SS Order ID</Text>
                  <Text style={styles.headerCell}>Amount</Text>
                  <Text style={styles.headerCell}>Currency</Text>
                  <Text style={styles.headerCell}>Status</Text>
                  <Text style={styles.headerCell}>Payment ID</Text>
                </View>

                {Array.isArray(paymentDetails.vendorPayments) && paymentDetails.vendorPayments.length > 0 ? (
                  paymentDetails.vendorPayments.map((payment: any, index: number) => (
                    <View key={index} style={styles.row}>
                      <Text style={styles.cell}>{payment?.razorpayOrderId || '-'}</Text>
                      <Text style={styles.cell}>{payment?.orderId || '-'}</Text>
                      <Text style={styles.cell}>{payment?.price ?? '-'}</Text>
                      <Text style={styles.cell}>{payment?.currency || '-'}</Text>
                      <Text style={styles.cell}>{payment?.paymentStatus || '-'}</Text>
                      <Text style={styles.cell}>{payment?.razorpayPaymentId || '-'}</Text>
                    </View>
                  ))
                ) : (
                  <View style={styles.noDataRow}>
                    <Text style={styles.noDataText}>No payment data available</Text>
                  </View>
                )}
              </View>
            </ScrollView> */}

            <TouchableOpacity onPress={logout} style={styles.logoutButton} activeOpacity={0.7}>
              <ThemedText style={styles.logoutButtonText}>Logout</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      ) : (
        <ThemedView style={styles.notLoggedInContainer}>
          <ThemedText style={styles.notLoggedInText}>You are not logged in</ThemedText>
        </ThemedView>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  titleText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#007AFF',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
    flex: 1,
  },
  userInfo: {
    marginBottom: 24,
  },
  userName: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 6,
    color: '#222',
  },
  userEmail: {
    fontSize: 16,
    color: '#555',
  },
  categoryContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  earningsContainer: {
    marginTop: 12,
  },
  earningsText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  tableScrollView: {
    marginBottom: 20,
  },
  table: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerRow: {
    backgroundColor: '#f0f0f0',
  },
  headerCell: {
    padding: 10,
    minWidth: 150,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  cell: {
    padding: 10,
    minWidth: 150,
    textAlign: 'center',
    color: '#000',
  },
  noDataRow: {
    padding: 20,
  },
  noDataText: {
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignSelf: 'center',
    marginTop: 10,
    minWidth: 140,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 18,
    textAlign: 'center',
  },
  notLoggedInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  notLoggedInText: {
    fontSize: 18,
    color: '#888',
  },
});

