import { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { getToken, removeToken } from '@/helpers/expoSecureStore';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

export function Headers({ isLogin, setIsLogin, user }:any) {

  
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  useEffect(() => {
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

  const loginLogout = async() => {
    const token = await getToken('token');
    if (!token) {
      setShowLoginModal(true);
      setIsLogin(false)
    }
    // else {
    //   await removeToken('token')
    //   setIsLogin(false)
    // }
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
      <LoginForm showLoginModal={showLoginModal} setShowLoginModal={setShowLoginModal} setIsLogin={setIsLogin} openSignupModal={openSignupModal}/>
      <SignupForm showSignupModal={showSignupModal} setShowSignupModal={setShowSignupModal} setIsLogin={setIsLogin} openLoginModal={openLoginModal} />
      <View>
        <ThemedText style={styles.logo}>smartshop.ai</ThemedText>
      </View>
      <TouchableOpacity onPress={loginLogout} style={styles.logoutButton} activeOpacity={0.7}>
        <ThemedText style={styles.logoutButtonText}>
          {isLogin ? user?.name ? user?.name[0] : '' : 'Login'}
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
    height: 130,
    alignItems: 'center',
    padding: '30px',
    paddingLeft: 30,
    paddingRight: 30,
    zIndex: 100
  },
  logo: {
    fontSize: 24,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#007AFF', // blue background
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  }
});
