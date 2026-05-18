import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  StyleSheet, 
  ScrollView 
} from 'react-native';
import { useClimaViewModel } from '../viewmodels/ClimaViewModel';

export default function TelaPrincipal() {
  const [cidadePesquisa, setCidadePesquisa] = useState('');
  

  const { 
    clima, 
    carregando, 
    erro, 
    historico, 
    buscarCidade, 
    buscarPorLocalizacao 
  } = useClimaViewModel();


  const lidarComBusca = () => {
    if (cidadePesquisa.trim() === '') return;
    buscarCidade(cidadePesquisa);
    setCidadePesquisa(''); 
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.tituloApp}>Agro-Clima</Text>


      <View style={styles.containerBusca}>
        <TextInput
          style={styles.input}
          placeholder="Cidade, País (ex: Paris, FR ou Paris, US)"
          placeholderTextColor="#888"
          value={cidadePesquisa}
          onChangeText={setCidadePesquisa}
          onSubmitEditing={lidarComBusca} 
        />
      </View>


      <TouchableOpacity 
        style={styles.botaoGps} 
        onPress={buscarPorLocalizacao}
        disabled={carregando}
      >
        <Text style={styles.textoBotaoGps}>📍 Usar Localização do Celular</Text>
      </TouchableOpacity>

  
      {historico.length > 0 && (
        <View style={styles.containerHistorico}>
          <Text style={styles.tituloHistorico}>Pesquisas Recentes:</Text>
          <View style={styles.listaTags}>
            {historico.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.tag}
                onPress={() => buscarCidade(item)} 
              >
                <Text style={styles.textoTag}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}


      {carregando && (
        <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
      )}


      {erro && !carregando && (
        <Text style={styles.textoErro}>{erro}</Text>
      )}


      {clima && !carregando && (
        <View style={styles.cartaoClima}>
   
          <Text style={styles.nomeCidade}>{clima.cidade}</Text>
          

          <Text style={styles.temperatura}>{clima.temperatura}°C</Text>
          
          <View style={styles.divisor} />

      
          <View style={styles.detalhesContainer}>
            <Text style={styles.textoDetalhe}>Sensação: {clima.sensacaoTermica}°C</Text>
            <Text style={styles.textoDetalhe}>Umidade: {clima.umidade}%</Text>
            <Text style={styles.statusClima}>{clima.descricao}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  tituloApp: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 20,
    textAlign: 'center',
  },
  containerBusca: {
    width: '100%',
    maxWidth: 600,
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  botaoGps: {
    backgroundColor: '#e64a19',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  textoBotaoGps: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  containerHistorico: {
    width: '100%',
    maxWidth: 600,
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  tituloHistorico: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    marginBottom: 8,
  },
  listaTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#d0dbe5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  textoTag: {
    color: '#2c3e50',
    fontSize: 13,
    fontWeight: '500',
  },
  loader: {
    marginTop: 30,
  },
  textoErro: {
    color: '#d32f2f',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    fontWeight: '500',
    paddingHorizontal: 10,
  },
  cartaoClima: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nomeCidade: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  temperatura: {
    fontSize: 54,
    fontWeight: '300',
    color: '#1976d2',
    marginVertical: 5,
  },
  divisor: {
    width: '80%',
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },
  detalhesContainer: {
    alignItems: 'center',
    width: '100%',
  },
  textoDetalhe: {
    fontSize: 15,
    color: '#555',
    marginBottom: 5,
  },
  statusClima: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    textTransform: 'capitalize',
  },
});