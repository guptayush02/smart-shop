import { useEffect, useState, useCallback } from 'react';
import { Image } from 'expo-image';
import { Platform, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
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

export default function Addresses({ setIsAddressModalOpen, user, textColor = 'white', themeColor = 'transparent' }:any) {

  return (
    <View style={{backgroundColor: themeColor}}>
      <ThemedView style={[styles.titleContainer, {backgroundColor: themeColor}]}>
        <ThemedText style={{color: textColor}} type="title">Addresses:</ThemedText>
      </ThemedView>
      <TouchableOpacity onPress={() => setIsAddressModalOpen((prev:any) => !prev)}><ThemedText style={{color: textColor}}>+ Add another address</ThemedText></TouchableOpacity>
      {
        user?.Profiles?.map((profile: any, ind:number) => (
          <View key={ind}>
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
  }
});
