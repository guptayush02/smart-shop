import { useEffect, useState, useCallback } from 'react';
import { Image } from 'expo-image';
import { Platform, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Headers } from '@/components/Headers';
import httpRequest from '@/helpers/httpRequests';
import AddAddressForm from '@/components/AddAddressForm';
import Addresses from '@/components/Addresses';
import { getToken, removeToken } from '@/helpers/expoSecureStore';

export default function TabTwoScreen() {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState<any>({});
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchProfileData();
      const checkToken = async() => {
        const token = await getToken('token');
        if (token) {
          setIsLogin(true)
        } else {
          setIsLogin(false)
        }
      }
      checkToken()
    }, [isLogin])
  );

  const fetchProfileData = async () => {
    console.log("fetchProfileData:")
    console.log("isLofin:", isLogin);
    if (isLogin) {
      const response: any = await httpRequest.get('api/v1/auth/profile');
      if (response.data.status === 200) {
        setUser(response.data.data);
      }
    }
  };

  const logout = async() => {
    await removeToken('token');
    setIsLogin(false);
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Headers isLogin={isLogin} setIsLogin={setIsLogin} user={user} />
      }>
        <AddAddressForm isAddressModalOpen={isAddressModalOpen} setIsAddressModalOpen={setIsAddressModalOpen} fetchProfileData={fetchProfileData} />
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title" style={styles.titleText}>
            Settings
          </ThemedText>
        </ThemedView>

        {isLogin ? (
          <ThemedView style={styles.contentContainer}>
            <View style={styles.userInfo}>
              <ThemedText style={styles.userName}>{user?.name}</ThemedText>
              <ThemedText style={styles.userEmail}>{user?.email}</ThemedText>
            </View>

            <Addresses
              setIsAddressModalOpen={setIsAddressModalOpen}
              user={user}
              fetchProfileData={fetchProfileData}
              textColor="black"
            />

            <TouchableOpacity onPress={logout} style={styles.logoutButton} activeOpacity={0.7}>
              <ThemedText style={styles.logoutButtonText}>Logout</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        ) : (
          <ThemedText style={styles.notLoggedInText}>You are not logged in</ThemedText>
        )}

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
    // display: 'flex',
    // gap: 30
    // paddingHorizontal: 16,
    // paddingVertical: 12,
    // borderBottomWidth: 1,
    // borderColor: '#ccc',
    // backgroundColor: '#f8f8f8',
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    // Elevation for Android
    elevation: 4,
    flex: 1,
  },
  logoutButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignSelf: 'center',
    marginTop: 20,
    minWidth: 140,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 18,
    textAlign: 'center',
  },
  titleText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#007AFF',
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
  notLoggedInText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 18,
    color: '#888',
  },
});
