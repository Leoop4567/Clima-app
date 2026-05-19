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
        <Text style={styles.textoBotaoGps}>Usar Localização do Celular</Text>
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
    paddingTop: 40, // Diminuído para colar mais no topo
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: 'center', // Ajuda a centralizar se sobrar espaço
  },
  tituloApp: {
    fontSize: 28, // Levemente menor
    fontWeight: '900',
    color: '#2C5E1A', 
    marginBottom: 16, // Margem reduzida
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  containerBusca: {
    width: '100%',
    maxWidth: 600,
    marginBottom: 12, // Margem reduzida
  },
  input: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12, // Altura do input menor
    borderRadius: 14,
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
    paddingVertical: 12, // Botão ligeiramente mais fino
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 16, // Margem reduzida
    width: '100%',
    maxWidth: 600,
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
    marginBottom: 16, // Margem reduzida
    alignItems: 'flex-start',
  },
  tituloHistorico: {
    fontSize: 13,
    color: '#7F8C8D', 
    fontWeight: '700',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  listaTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#E8F5E9', 
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#C8E6C9', 
  },
  textoTag: {
    color: '#2E7D32', 
    fontSize: 13,
    fontWeight: '600',
  },
  loader: {
    marginTop: 20,
  },
  textoErro: {
    color: '#E74C3C',
    fontSize: 14,
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
    borderRadius: 20, 
    paddingVertical: 24, // Reduzido o espaço interno do cartão
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 5,
    shadowColor: '#2C5E1A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E8F5E9',
  },
  nomeCidade: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2C3E50',
    marginBottom: 4,
    textAlign: 'center',
  },
  temperatura: {
    fontSize: 60, // Encolhido de 72 para caber melhor
    fontWeight: '300',
    color: '#2980B9', 
    marginVertical: 4,
  },
  divisor: {
    width: '60%',
    height: 2,
    backgroundColor: '#F0F3F4',
    marginVertical: 12, // Reduzido
    borderRadius: 2,
  },
  detalhesContainer: {
    alignItems: 'center',
    width: '100%',
    gap: 4, 
  },
  textoDetalhe: {
    fontSize: 15,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  statusClima: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C5E1A', 
    marginTop: 6,
    textTransform: 'capitalize',
  },
});