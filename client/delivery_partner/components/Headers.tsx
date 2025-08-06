import { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Platform, TextInput, FlatList } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { getData, removeData } from '@/helpers/expoSecureStore';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import httpRequest from '@/helpers/httpRequests';
import { CustomDropdown } from './CustomDropdown';

export function Headers({ isLogin, setIsLogin }:any) {

  
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  useEffect(() => {
    const checkToken = async() => {
      const token = await getData('token');
      if (token) {
        setIsLogin(true)
      } else {
        setIsLogin(false)
      }
    }
    checkToken()
  }, [isLogin])

  const loginLogout = async() => {
    const token = await getData('token');
    if (!token) {
      setShowLoginModal(true);
      setIsLogin(false)
    } else {
      await removeData('token')
      setIsLogin(false)
    }
  }

  const openSignupModal = () => {
    setShowSignupModal(true);
    setShowLoginModal(false);
  }

  const openLoginModal = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  }

  return (
    <View style={styles.header}>
      <LoginForm showLoginModal={showLoginModal} setShowLoginModal={setShowLoginModal} setIsLogin={setIsLogin} openSignupModal={openSignupModal} />
      <SignupForm showSignupModal={showSignupModal} setShowSignupModal={setShowSignupModal} setIsLogin={setIsLogin} openLoginModal={openLoginModal} />
      <View>
        <ThemedText>smartshop.ai</ThemedText>
      </View>
      <TouchableOpacity onPress={loginLogout}>
        <ThemedText>
          {
            isLogin ? 'Logout' : 'Login'
          }
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 28,
    lineHeight: 32,
    marginTop: -6,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '100%',
    alignItems: 'center',
    padding: '20px'
  }
});
