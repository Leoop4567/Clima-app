import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function TelaInicio() {
  const [cidade, setCidade] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Previsão do Tempo</Text>
      
      <TextInput 
        style={styles.entrada}
        placeholder="Digite a cidade (Ex: Salvador, BR)"
        value={cidade}
        onChangeText={setCidade}
      />

      <Button 
        title="Buscar Clima" 
        onPress={() => console.log('Buscando clima de:', cidade)} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  titulo: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  entrada: { borderWidth: 1, borderColor: '#bbb', padding: 12, marginBottom: 15, borderRadius: 8, backgroundColor: '#fff' }
});