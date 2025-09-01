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
import VendorNotLoggedinSettings from '@/components/VendorNotLoggedinSettings';

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

            <TouchableOpacity onPress={logout} style={styles.logoutButton} activeOpacity={0.7}>
              <ThemedText style={styles.logoutButtonText}>Logout</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      ) : (
        <VendorNotLoggedinSettings />
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
  paymentListContainer: {
    gap: 20
  }
});

