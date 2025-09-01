import React from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default function RazorpayWebView({ isVisible, onClose, paymentUrl }: { isVisible: boolean, onClose: (success: boolean) => void, paymentUrl: string }) {

  const handleNavigationChange = async(navState: any) => {
    console.log("navState:", navState)
    const url = navState.url;
    console.log("url:", url)
    
    // Example: Your backend or Razorpay redirects to specific URL on success/fail
    if (url.includes('payment-success')) {
      onClose(true);
    } else if (url.includes('payment-failure')) {
      onClose(false);
    } else if (url.includes('payment-callback')) {
      const response:any = await fetch(url);
      const data:any = await response.json();
      // Pass success true and data back to caller
      onClose(data);
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide">
      <View style={{ flex: 1 }}>
        <WebView
          source={{ uri: paymentUrl }}
          onNavigationStateChange={handleNavigationChange}
          startInLoadingState={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      </View>
    </Modal>
  );
}
