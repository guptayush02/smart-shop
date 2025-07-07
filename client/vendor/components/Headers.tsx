import { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { getToken, removeToken } from '@/helpers/expoSecureStore';
import LoginForm from './LoginForm';

export function Headers({ isLogin, setIsLogin }:any) {

  
  const [showLoginModal, setShowLoginModal] = useState(false);

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
    } else {
      await removeToken('token')
      setIsLogin(false)
    }
  }

  return (
    <View style={styles.header}>
      <LoginForm showLoginModal={showLoginModal} setShowLoginModal={setShowLoginModal} setIsLogin={setIsLogin}/>
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
