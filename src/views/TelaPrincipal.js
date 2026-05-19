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
      {/* Cabeçalho Temático Agro */}
      <Text style={styles.tituloApp}>Agro-Clima</Text>

      {/* Input de Pesquisa com Cantos Arredondados */}
      <View style={styles.containerBusca}>
        <TextInput
          style={styles.input}
          placeholder="Cidade, País (ex: Paris, FR ou Paris, US)"
          placeholderTextColor="#94A3B8"
          value={cidadePesquisa}
          onChangeText={setCidadePesquisa} 
        />
      </View>

      {/* Linhas Simbólicas de Cultivo ao Fundo */}
      <View style={styles.linhasPlantacaoContainer}>
        <View style={styles.linhaCampo} />
        <View style={[styles.linhaCampo, { width: '80%', alignSelf: 'center' }]} />
      </View>

      {/* Card Principal de Clima (Visual Glassmorphism da imagem) */}
      {clima && !carregando && (
        <View style={styles.cartaoClima}>
          <Text style={styles.nomeCidade}>{clima.cidade}</Text>
          
          <View style={styles.boxTemperatura}>
            <Text style={styles.nuvemIcon}>☁️</Text>
            <Text style={styles.temperatura}>{clima.temperatura}°C</Text>
          </View>
          
          <View style={styles.containerStatus}>
            <Text style={styles.statusClima}>☁️ {clima.descricao}</Text>
          </View>
          
          <View style={styles.divisor} />

          <View style={styles.detalhesContainer}>
            <Text style={styles.textoDetalhe}>Sensação: {clima.sensacaoTermica}°C</Text>
            <Text style={styles.textoDetalhe}>Umidade: {clima.umidade}%</Text>
          </View>

          {/* Botão Hambúrguer na Lateral do Card */}
          <TouchableOpacity style={styles.botaoMenuFlutuante}>
            <Text style={styles.textoMenuFlutuante}>☰</Text>
          </TouchableOpacity>
        </View>
      )}

      {carregando && (
        <ActivityIndicator size="large" color="#2E5A27" style={styles.loader} />
      )}

      {erro && !carregando && (
        <Text style={styles.textoErro}>{erro}</Text>
      )}

      {/* Botão de Localização Estilizado sem o texto "do campo" */}
      <TouchableOpacity 
        style={styles.botaoGps} 
        onPress={buscarPorLocalizacao}
        disabled={carregando}
      >
        <Text style={styles.textoBotaoGps}>☀️ Usar Minha Localização</Text>
      </TouchableOpacity>

      {/* Histórico de Pesquisas Estilizado com Folhas */}
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
                <Text style={styles.textoTag}>🌱 {item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
    paddingTop: 40,
    paddingBottom: 30,
    backgroundColor: '#EEF5ED', // Fundo verde-claro orgânico pastel da imagem
    minHeight: '100%'
  },
  tituloApp: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2E5A27', // Verde escuro agro
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  containerBusca: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    justifyContent: 'center',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  input: {
    fontSize: 16,
    color: '#334155',
  },
  linhasPlantacaoContainer: {
    marginVertical: 12,
    gap: 4,
    opacity: 0.3,
  },
  linhaCampo: {
    height: 2,
    backgroundColor: '#81C784',
    width: '100%',
  },
  cartaoClima: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingTop: 35,
    paddingBottom: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'relative',
    elevation: 8,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    marginBottom: 24,
  },
  nomeCidade: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1E293B',
  },
  boxTemperatura: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    position: 'relative',
  },
  nuvemIcon: {
    fontSize: 64,
    position: 'absolute',
    opacity: 0.25,
    left: -45,
    top: 10,
  },
  temperatura: {
    fontSize: 76,
    fontWeight: '300',
    color: '#1D4ED8', // Azul clima destacado
  },
  containerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -5,
  },
  statusClima: {
    fontSize: 20,
    fontWeight: '600',
    color: '#475569',
    textTransform: 'capitalize',
  },
  divisor: {
    width: '85%',
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 18,
  },
  detalhesContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 6,
  },
  textoDetalhe: {
    fontSize: 16,
    color: '#475569',
    fontWeight: '500',
  },
  botaoMenuFlutuante: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#E2E8F0',
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  textoMenuFlutuante: {
    fontSize: 20,
    color: '#334155',
  },
  botaoGps: {
    backgroundColor: '#D97706', // O dourado/mostarda da imagem
    borderRadius: 25,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    alignSelf: 'center',
    marginBottom: 28,
    elevation: 4,
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  textoBotaoGps: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  containerHistorico: {
    width: '100%',
  },
  tituloHistorico: {
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 12,
  },
  listaTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tag: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0', // Bordinha verde-menta
    elevation: 1,
  },
  textoTag: {
    color: '#15803D',
    fontSize: 14,
    fontWeight: '600',
  },
  loader: {
    marginVertical: 20,
  },
  textoErro: {
    color: '#DC2626',
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: '600',
  }
});