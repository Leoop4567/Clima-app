import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  Platform
} from 'react-native';
import { GerenciadorBanco } from '../database/GerenciadorBanco';

export default function TelaPrincipal() {
  const [cidade, setCidade] = useState('');
  const [clima, setClima] = useState(null);
  const [loading, setLoading] = useState(false);
  const [historico, setHistorico] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarHistorico();
  }, []);

  const carregarHistorico = async () => {
    const dados = await GerenciadorBanco.buscarHistorico();
    setHistorico(dados);
  };


  const buscarClima = async (nomeCidade) => {
    if (!nomeCidade.trim()) return;
    setLoading(true);
    setErro('');
    try {

      setTimeout(async () => {
        setClima({
          cidade: nomeCidade,
          temp: 16,
          sensacao: 15,
          umidade: 53,
          descricao: 'Nublado'
        });
        await GerenciadorBanco.salvarCidade(nomeCidade);
        carregarHistorico();
        setLoading(false);
      }, 600);
    } catch (e) {
      setErro('Erro ao buscar dados.');
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      

      <Text style={styles.tituloPrincipal}>Agro-Clima</Text>

  
      <TextInput
        style={styles.inputPesquisa}
        placeholder="Cidade, País (ex: Paris, FR ou Paris, US)"
        placeholderTextColor="#94A3B8"
        value={cidade}
        onChangeText={setCidade}
        onSubmitEditing={() => buscarClima(cidade)}
      />

      <View style={styles.linhasPlantacaoContainer}>
        <View style={styles.linhaCampo} />
        <View style={[styles.linhaCampo, { width: '80%', alignSelf: 'center' }]} />
        <View style={[styles.linhaCampo, { width: '60%', alignSelf: 'center' }]} />
      </View>


      {clima && (
        <View style={styles.cardClima}>
          <Text style={styles.cidadeClima}>{clima.cidade}</Text>
          
  
          <View style={styles.boxTemperatura}>
            <Text style={styles.nuvemIcon}>☁️</Text>
            <Text style={styles.temperaturaClima}>{clima.temp}°C</Text>
          </View>

          <View style={styles.containerStatus}>
            <Text style={styles.ventoIcon}>💨</Text>
            <Text style={styles.statusClima}>{clima.descricao}</Text>
          </View>

          <View style={styles.linhaDivisoria} />

          <View style={styles.containerDetalhes}>
            <Text style={styles.textoDetalhe}>Sensação: {clima.sensacao}°C</Text>
            <Text style={styles.textoDetalhe}>Umidade: {clima.umidade}%</Text>
          </View>

      
          <TouchableOpacity style={styles.botaoMenuFlutuante}>
            <Text style={styles.textoMenuFlutuante}>☰</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading && <ActivityIndicator size="large" color="#2E7D32" style={{ marginVertical: 20 }} />}
      {erro ? <Text style={styles.textoErro}>{erro}</Text> : null}

  
      <TouchableOpacity style={styles.botaoLocalizacao} onPress={() => buscarClima('Sua Localização')}>
        <Text style={styles.iconeBotao}>☀️ </Text>
        <Text style={styles.textoBotaoLocalizacao}>Usar Minha Localização</Text>
      </TouchableOpacity>


      <View style={styles.containerHistorico}>
        <Text style={styles.tituloSecao}>Pesquisas Recentes:</Text>
        <View style={styles.listaTags}>
          {historico.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.tagHistorico}
              onPress={() => buscarClima(item)}
            >
              <Text style={styles.textoTag}>🌱 {item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF5ED', 
  },
  contentContainer: {
    paddingHorizontal: 22,
    paddingTop: 40,
    paddingBottom: 30,
  },
  tituloPrincipal: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2E5A27',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  inputPesquisa: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    fontSize: 16,
    color: '#334155',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
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

  cardClima: {
    backgroundColor: Platform.OS === 'web' ? 'rgba(255, 255, 255, 0.75)' : '#FFFFFF',
    borderRadius: 24,
    paddingTop: 35,
    paddingBottom: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    elevation: 8,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    marginBottom: 24,
  },
  cidadeClima: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: 0.3,
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
  temperaturaClima: {
    fontSize: 76,
    fontWeight: '300', 
    color: '#1D4ED8',
  },
  containerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: -5,
  },
  ventoIcon: {
    fontSize: 18,
    opacity: 0.6,
  },
  statusClima: {
    fontSize: 20,
    fontWeight: '600',
    color: '#475569',
  },
  linhaDivisoria: {
    width: '85%',
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 18,
  },
  containerDetalhes: {
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

  botaoLocalizacao: {
    backgroundColor: '#D97706',
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
  iconeBotao: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  textoBotaoLocalizacao: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  containerHistorico: {
    width: '100%',
  },
  tituloSecao: {
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

  tagHistorico: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0', 
    elevation: 1,
  },
  textoTag: {
    color: '#15803D',
    fontSize: 14,
    fontWeight: '600',
  },
  textoErro: {
    color: '#DC2626',
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: '600',
  }
});