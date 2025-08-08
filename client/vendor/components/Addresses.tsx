// import { useEffect, useState, useCallback } from 'react';
// import { Image } from 'expo-image';
// import { Platform, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
// import Checkbox from 'expo-checkbox';
// import { useFocusEffect } from '@react-navigation/native';
// import { Collapsible } from '@/components/Collapsible';
// import { ExternalLink } from '@/components/ExternalLink';
// import ParallaxScrollView from '@/components/ParallaxScrollView';
// import { ThemedText } from '@/components/ThemedText';
// import { ThemedView } from '@/components/ThemedView';
// import { IconSymbol } from '@/components/ui/IconSymbol';
// import { Headers } from '@/components/Headers';
// import httpRequest from '@/helpers/httpRequests';
// import AddAddressForm from '@/components/AddAddressForm';

// export default function Addresses({ setIsAddressModalOpen, user, fetchProfileData, textColor = 'white', themeColor = 'transparent' }:any) {

//   const onChangeDefaultAddress = async(event:any, userProfile:any) => {
//     const response:any = await httpRequest.put(`api/v1/auth/profile/${userProfile?.id}`, { defaultAddress: event });
//     if (response?.status === 200) {
//       fetchProfileData()
//     }
//   }

//   return (
//     <View style={{backgroundColor: themeColor}}>
//       <ThemedView style={[styles.titleContainer, {backgroundColor: themeColor}]}>
//         <ThemedText style={{color: textColor}} type="title">Addresses</ThemedText>
//       </ThemedView>
//       <TouchableOpacity onPress={() => setIsAddressModalOpen((prev:any) => !prev)}><ThemedText style={{color: textColor}}>+ Add another address</ThemedText></TouchableOpacity>
//       {
//         user?.Profiles?.map((profile: any, ind:number) => (
//           <View key={ind} style={styles.addresses}>
//             <Checkbox
//               value={profile.defaultAddress}
//               onValueChange={(event:any) => onChangeDefaultAddress(event, profile)}
//               style={styles.checkbox}
//             />
//             <ThemedText style={{color: textColor}}>{profile?.address}</ThemedText>
//           </View>
//         ))
//       }
//     </View>
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
//     gap: 30
//   },
//   addresses: {
//     display: 'flex',
//     flexDirection: 'row',
//     gap: 20,
//     alignItems: 'center'
//   }
// });

import { useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Checkbox from 'expo-checkbox';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import httpRequest from '@/helpers/httpRequests';

export default function Addresses({
  setIsAddressModalOpen,
  user,
  fetchProfileData,
  textColor = 'white',
  themeColor = 'transparent',
}: any) {
  
  const onChangeDefaultAddress = useCallback(async (value: boolean, userProfile: any) => {
    const response: any = await httpRequest.put(`api/v1/auth/profile/${userProfile?.id}`, { defaultAddress: value });
    if (response?.status === 200) {
      fetchProfileData();
    }
  }, [fetchProfileData]);

  return (
    <View style={[styles.container, { backgroundColor: themeColor }]}>
      <ThemedView style={[styles.titleContainer, { backgroundColor: themeColor }]}>
        <ThemedText style={[styles.titleText, { color: textColor }]} type="title">Addresses</ThemedText>
      </ThemedView>

      <TouchableOpacity
        onPress={() => setIsAddressModalOpen((prev: any) => !prev)}
        style={styles.addAddressButton}
        activeOpacity={0.7}
      >
        <ThemedText style={[styles.addAddressText, { color: textColor }]}>+ Add another address</ThemedText>
      </TouchableOpacity>

      {user?.Profiles?.map((profile: any, index: number) => (
        <View key={index} style={styles.addressRow}>
          <Checkbox
            value={profile.defaultAddress}
            onValueChange={(val: boolean) => onChangeDefaultAddress(val, profile)}
            style={styles.checkbox}
            color={profile.defaultAddress ? '#007AFF' : undefined}
          />
          <ThemedText style={[styles.addressText, { color: textColor }]} numberOfLines={2}>
            {profile?.address || 'No Address'}
          </ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '700',
  },
  addAddressButton: {
    marginBottom: 16,
  },
  addAddressText: {
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    marginRight: 14,
    borderRadius: 4,
  },
  addressText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
  },
});
