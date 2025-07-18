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

export default function TabTwoScreen() {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState<any>({});
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

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
              <Addresses setIsAddressModalOpen={setIsAddressModalOpen} user={user} fetchProfileData={fetchProfileData} />
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
    gap: 30
  }
});
