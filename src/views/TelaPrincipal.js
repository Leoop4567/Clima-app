import React, { useState } from 'react';
import { View, Text, TextInput, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useClimaViewModel } from '../viewmodels/ClimaViewModel';

export default function TelaPrincipal() {
  const [textoBusca, setTextoBusca] = useState('');
  const { clima, carregando, erro, historico, buscarCidade, buscarPorLocalizacao } = useClimaViewModel();

  const aoDispararBusca = () => {
    buscarCidade(textoBusca);
    setTextoBusca('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Agro-Clima</Text>
      
      <TextInput 
        style={styles.input}
        placeholder="Digite a cidade e aperte Enter"
        value={textoBusca}
        onChangeText={setTextoBusca}
        onSubmitEditing={aoDispararBusca}
        returnKeyType="search"
      />

      <TouchableOpacity style={styles.botaoGPS} onPress={buscarPorLocalizacao}>
        <Text style={styles.textoBotaoGPS}>📍 Usar Localização do Celular</Text>
      </TouchableOpacity>

  
      {historico.length > 0 && (
        <View style={styles.containerHistorico}>
          <Text style={styles.tituloHistorico}>Pesquisas Recentes:</Text>
          <View style={styles.listaHistorico}>
            {historico.map((cidade, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.tagHistorico} 
                onPress={() => buscarCidade(cidade)}
              >
                <Text style={styles.textoTag}>{cidade}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {carregando && <ActivityIndicator size="large" color="#2ecc71" style={{ marginTop: 20 }} />}
      
      {erro && <Text style={styles.textoErro}>{erro}</Text>}

      {clima && !carregando && (
        <View style={styles.cartaoClima}>
          <Text style={styles.nomeCidade}>{clima.cidade}</Text>
          <Text style={styles.temperatura}>{clima.temperatura}°C</Text>
          
          <View style={styles.divisor} />
          
          <Text style={styles.detalhe}>Sensação: {clima.sensacaoTermica}°C</Text>
          <Text style={styles.detalhe}>Umidade: {clima.umidade}%</Text>
          <Text style={styles.descricao}>{clima.descricao}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 30, backgroundColor: '#f4f7f6', alignItems: 'center' },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#2ecc71', marginBottom: 20, marginTop: 40 },
  input: { width: '100%', height: 50, borderWidth: 1, borderColor: '#dcdde1', borderRadius: 12, paddingHorizontal: 15, backgroundColor: '#fff', fontSize: 16 },
  botaoGPS: { marginTop: 12, backgroundColor: '#e74c3c', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  textoBotaoGPS: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  containerHistorico: { width: '100%', marginTop: 20, alignItems: 'flex-start' },
  tituloHistorico: { fontSize: 14, color: '#7f8c8d', marginBottom: 8, fontWeight: '600' },
  listaHistorico: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagHistorico: { backgroundColor: '#e2e8f0', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 15 },
  textoTag: { color: '#475569', fontSize: 13, fontWeight: '500' },
  textoErro: { color: '#e84118', marginTop: 20 },
  cartaoClima: { marginTop: 25, padding: 25, backgroundColor: '#fff', borderRadius: 20, width: '100%', alignItems: 'center', elevation: 4 },
  nomeCidade: { fontSize: 22, fontWeight: '600', color: '#2c3e50' },
  temperatura: { fontSize: 64, fontWeight: '300', color: '#2980b9', marginVertical: 10 },
  divisor: { width: '80%', height: 1, backgroundColor: '#f1f2f6', marginVertical: 15 },
  detalhe: { fontSize: 16, color: '#7f8c8d', marginBottom: 5 },
  descricao: { fontSize: 18, color: '#2c3e50', textTransform: 'capitalize', marginTop: 10 }
});