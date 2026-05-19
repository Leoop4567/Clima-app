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
          placeholderTextColor="#7F8C8D"
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
        <ActivityIndicator size="large" color="#27AE60" style={styles.loader} />
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
    backgroundColor: '#F3F7F0',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  tituloApp: {
    fontSize: 32,
    fontWeight: '900',
    color: '#2C5E1A',
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  containerBusca: {
    width: '100%',
    maxWidth: 600,
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#D4E2D4',
    fontSize: 16,
    color: '#2C3E50',
    shadowColor: '#2C5E1A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  botaoGps: {
    backgroundColor: '#E67E22',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginBottom: 25,
    shadowColor: '#E67E22',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  textoBotaoGps: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  containerHistorico: {
    width: '100%',
    maxWidth: 600,
    marginBottom: 25,
    alignItems: 'flex-start',
  },
  tituloHistorico: {
    fontSize: 14,
    color: '#7F8C8D', 
    fontWeight: '700',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  listaTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tag: {
    backgroundColor: '#E8F5E9', 
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C8E6C9', 
  },
  textoTag: {
    color: '#2E7D32', 
    fontSize: 14,
    fontWeight: '600',
  },
  loader: {
    marginTop: 30,
  },
  textoErro: {
    color: '#E74C3C',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    fontWeight: '600',
    paddingHorizontal: 10,
  },
  cartaoClima: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: '#ffffff',
    borderRadius: 24, 
    paddingVertical: 35,
    paddingHorizontal: 25,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#2C5E1A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#E8F5E9',
  },
  nomeCidade: {
    fontSize: 26,
    fontWeight: '800',
    color: '#2C3E50',
    marginBottom: 8,
    textAlign: 'center',
  },
  temperatura: {
    fontSize: 72, 
    fontWeight: '300',
    color: '#2980B9', 
    marginVertical: 10,
  },
  divisor: {
    width: '60%',
    height: 2,
    backgroundColor: '#F0F3F4',
    marginVertical: 20,
    borderRadius: 2,
  },
  detalhesContainer: {
    alignItems: 'center',
    width: '100%',
    gap: 6, 
  },
  textoDetalhe: {
    fontSize: 16,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  statusClima: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C5E1A', 
    marginTop: 8,
    textTransform: 'capitalize',
  },
});