import { useEffect, useState, useCallback } from 'react';
import { Image } from 'expo-image';
import { Platform, StyleSheet, View, TouchableOpacity, Text, CheckBox } from 'react-native';
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

export default function Addresses({ setIsAddressModalOpen, user, fetchProfileData, textColor = 'white', themeColor = 'transparent' }:any) {

  const onChangeDefaultAddress = async(event:any, userProfile:any) => {
    const response:any = await httpRequest.put(`api/v1/auth/profile/${userProfile?.id}`, { defaultAddress: event });
    if (response?.status === 200) {
      fetchProfileData()
    }
  }

  return (
    <View style={{backgroundColor: themeColor}}>
      <ThemedView style={[styles.titleContainer, {backgroundColor: themeColor}]}>
        <ThemedText style={{color: textColor}} type="title">Addresses</ThemedText>
      </ThemedView>
      <TouchableOpacity onPress={() => setIsAddressModalOpen((prev:any) => !prev)}><ThemedText style={{color: textColor}}>+ Add another address</ThemedText></TouchableOpacity>
      {
        user?.Profiles?.map((profile: any, ind:number) => (
          <View key={ind} style={styles.addresses}>
            <CheckBox
              value={profile.defaultAddress}
              onValueChange={(event:any) => onChangeDefaultAddress(event, profile)}
              style={styles.checkbox}
            />
            <ThemedText style={{color: textColor}}>{profile?.address}</ThemedText>
          </View>
        ))
      }
    </View>
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
  },
  addresses: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center'
  }
});
