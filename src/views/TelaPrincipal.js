import React, { useState, useEffect } from 'react';
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

  
  useEffect(() => {
    if (cidadePesquisa.trim() === '') return;

    const temporizador = setTimeout(() => {
      buscarCidade(cidadePesquisa);
    }, 1500); 


    return () => clearTimeout(temporizador);
  }, [cidadePesquisa]);

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
    flex: 1,
    backgroundColor: '#EAF2F8',
    padding: 20,
  },
  

  cardClima: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  
  nomeCidade: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  
  temperatura: {
    fontSize: 54,
    fontWeight: '300',
    color: '#1A5276',
  },
  
  statusClima: {
    fontSize: 18,
    color: '#546E7A',
    textTransform: 'capitalize',
    marginTop: 5,
  },

  
  containerPesquisa: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  
  botaoPesquisar: {
    backgroundColor: '#27AE60', 
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  
  textoBotao: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },

  
  tituloSecao: {
    fontSize: 16,
    fontWeight: '700',
    color: '#34495E',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  
  itemHistorico: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#27AE60', 
  },
  
  textoHistorico: {
    fontSize: 15,
    color: '#2C3E50',
    fontWeight: '500',
  }
});