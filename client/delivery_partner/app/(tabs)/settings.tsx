import { useEffect, useState, useCallback } from 'react';
import { Image } from 'expo-image';
import { Platform, StyleSheet, View, TouchableOpacity, ScrollView, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Headers } from '@/components/Headers';
import httpRequest from '@/helpers/httpRequests';
import AddAddressForm from '@/components/AddressForm';
import Addresses from '@/components/Addresses';
import { CategoriesDropdown } from '@/components/CategoryDropdown';

export default function TabTwoScreen() {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState<any>({});
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>([]);

  useFocusEffect(
    useCallback(() => {
      fetchProfileData();
      fetchPaymentsDetails();
    }, [isLogin])
  );

  const fetchPaymentsDetails = async() => {
    if(isLogin) {
      const paymentStatus = '';
      const response:any = await httpRequest.get(`api/v1/vendor/payment-details?paymentStatus=${paymentStatus}`);
      if (response.status === 200) {
        console.log("response.data.data:", response.data.data)
        setPaymentDetails(response.data.data);
      }
    }
  }

  const fetchProfileData = async () => {
    if (isLogin) {
      const response: any = await httpRequest.get('api/v1/auth/profile');
      if (response.data.status === 200) {
        setUser(response.data.data);
      }
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Headers isLogin={isLogin} setIsLogin={setIsLogin} />
      }>
        <AddAddressForm isAddressModalOpen={isAddressModalOpen} setIsAddressModalOpen={setIsAddressModalOpen} fetchProfileData={fetchProfileData} />
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Settings</ThemedText>
        </ThemedView>
        {
          isLogin ? (
            <ThemedView style={styles.contentContainer}>
              <View>
                <ThemedText>{user?.name}</ThemedText>
                <ThemedText>{user?.email}</ThemedText>
              </View>
              <View style={{ position: 'relative', zIndex: 999, gap: 8 }}>
                <ThemedText type="title">Category</ThemedText>
                <CategoriesDropdown isLogin={isLogin} getQuery={() => {}} />
              </View>
              <Addresses setIsAddressModalOpen={setIsAddressModalOpen} user={user} fetchProfileData={fetchProfileData} />

              <ThemedView style={{ position: 'relative', zIndex: 999, gap: 8 }}>
                <ThemedText>Total Earnings: {paymentDetails.totalPaid}rs</ThemedText>
                <ScrollView horizontal>
                  <View style={styles.table}>
                    {/* Header Row */}
                    <View style={[styles.row, styles.headerRow]}>
                    <Text style={styles.headerCell}>Order ID</Text>
                      <Text style={styles.headerCell}>SS Order ID</Text>
                      <Text style={styles.headerCell}>Amount</Text>
                      <Text style={styles.headerCell}>Currency</Text>
                      <Text style={styles.headerCell}>Status</Text>
                      <Text style={styles.headerCell}>PaymentID</Text>
                    </View>

                    {/* Data Rows */}
                    {paymentDetails?.vendorPayments?.length && paymentDetails?.vendorPayments.map((payment:any, index:number) => (
                      <View key={index} style={styles.row}>
                        <Text style={styles.cell}>{payment?.razorpayOrderId}</Text>
                        <Text style={styles.cell}>{payment?.orderId}</Text>
                        <Text style={styles.cell}>{payment?.price}</Text>
                        <Text style={styles.cell}>{payment?.currency}</Text>
                        <Text style={styles.cell}>{payment?.paymentStatus}</Text>
                        <Text style={styles.cell}>{payment?.razorpayPaymentId}</Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </ThemedView>
            </ThemedView>
          ) : (
            <ThemedText>You are not login</ThemedText>
          )
        }
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  contentContainer: {
    display: 'flex',
    gap: 30,
    height: 'auto'
  },
  table: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerRow: {
    backgroundColor: '#f0f0f0',
  },
  cell: {
    padding: 10,
    minWidth: 200,
    textAlign: 'center',
    color: 'white'
  },
  headerCell: {
    padding: 10,
    minWidth: 200,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
