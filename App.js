import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { PromoProvider, usePromo } from './src/context/PromoContext';
import LoginScreen from './src/screens/LoginScreen';
import ClienteScreen from './src/screens/ClienteScreen';
import LojistaScreen from './src/screens/LojistaScreen';

//Componente para decidir qual tela mostrar baseado no usuário
function RootNavigator() {
  const { usuario } = usePromo();

  if (!usuario) {
    return <LoginScreen />;
  }

  if (usuario.tipo === 'lojista') {
    return <LojistaScreen />;
  }

  return <ClienteScreen/>
}

export default function App() {
  return (
    <PromoProvider>
      <SafeAreaView style={styles.app}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" translucent={true} />
        <RootNavigator />
      </SafeAreaView>
    </PromoProvider>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});