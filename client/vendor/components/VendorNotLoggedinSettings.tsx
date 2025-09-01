import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function VendorNotLoggedinSettings({}:any) {
  return (
    <ThemedView style={styles.notLoggedInContainer}>
      <ThemedText type="title" style={styles.notLoggedInTitle}>
        Welcome to Smart Shop Vendor Settings
      </ThemedText>

      <ThemedText style={styles.notLoggedInSubtitle}>
        Manage your profile, addresses, categories, and track your earnings — everything you need to run your vendor business in one place.
      </ThemedText>

      <ThemedText style={styles.notLoggedInSubtitle}>
        Please log in or create an account to:
      </ThemedText>

      <View style={styles.bulletList}>
        <ThemedText style={styles.bullet}>• View and update your vendor profile</ThemedText>
        <ThemedText style={styles.bullet}>• Add or edit your delivery addresses</ThemedText>
        <ThemedText style={styles.bullet}>• Select your selling categories</ThemedText>
        <ThemedText style={styles.bullet}>• Track your payments and total earnings</ThemedText>
      </View>

      {/* <TouchableOpacity
        style={styles.loginButton}
        onPress={() => setShowLoginModal(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signupButton}
        onPress={() => setShowSignupModal(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.signupButtonText}>Sign Up</Text>
      </TouchableOpacity> */}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  notLoggedInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  notLoggedInTitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    color: '#007AFF',
  },
  notLoggedInSubtitle: {
    fontSize: 15,
    textAlign: 'center',
    color: '#555',
    marginBottom: 6,
    lineHeight: 20,
  },
  bulletList: {
    marginTop: 10,
    marginBottom: 20,
    width: '100%',
  },
  bullet: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginBottom: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  signupButton: {
    borderWidth: 1,
    borderColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  signupButtonText: {
    color: '#007AFF',
    fontWeight: '700',
    fontSize: 16,
  }  
})
