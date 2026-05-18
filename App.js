
import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import TelaPrincipal from './src/views/TelaPrincipal';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <TelaPrincipal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7f6',
  },
});