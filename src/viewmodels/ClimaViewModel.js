import { useState, useEffect } from 'react';
import { Platform } from 'react-native'; 
import * as Location from 'expo-location'; 
import { apiClima } from '../services/api';
import { Clima } from '../models/Clima';
import { GerenciadorBanco } from '../database/GerenciadorBanco';

const dicionarioPaises = {
  "BR": "Brasil",
  "US": "Estados Unidos",
  "IT": "Itália",
  "FR": "França",
  "PT": "Portugal",
  "ES": "Espanha",
  "AR": "Argentina",
  "NO": "Noruega",
  "CR": "Costa Rica",
  "GB": "Reino Unido",
  "DE": "Alemanha",
  "JP": "Japão"
};

export function useClimaViewModel() {
  const [clima, setClima] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    async function iniciar() {
      try {
        await GerenciadorBanco.configurarBanco();
        await atualizarListaHistorico();
        
        const listaAtual = await GerenciadorBanco.buscarHistorico();
        if (listaAtual.length > 0) {
          await buscarCidade(listaAtual[0]);
        }
      } catch (err) {
        console.error("Erro ao iniciar aplicação:", err);
      }
    }
    iniciar();
  }, []);

  const atualizarListaHistorico = async () => {
    const lista = await GerenciadorBanco.buscarHistorico();
    setHistorico(lista);
  };

  const buscarCidade = async (nomeCidade) => {
    if (!nomeCidade || nomeCidade.trim() === '') return;
    setCarregando(true);
    setErro(null);

    try {
      const respostaGeo = await apiClima.get('https://api.openweathermap.org/geo/1.0/direct', {
        params: { q: nomeCidade, limit: 1 }
      });

      if (respostaGeo.data.length === 0) {
        setErro("Cidade não encontrada.");
        setClima(null);
        return;
      }

      const { lat, lon, name: nomeOficial } = respostaGeo.data[0];
      await buscarPorCoordenadas(lat, lon, nomeOficial);

    } catch (err) {
      setErro("Erro na conexão com a API.");
    } finally {
      setCarregando(false);
    }
  };

  const buscarPorCoordenadas = async (lat, lon, nomeParaSalvar = null) => {
    setCarregando(true);
    try {
      const respostaClima = await apiClima.get('weather', {
        params: { lat, lon }
      });

      const novoClima = new Clima(respostaClima.data, nomeParaSalvar);
      
      const siglaPais = respostaClima.data.sys?.country;
      
      if (siglaPais && novoClima.cidade) {
        
        const paisTraduzido = dicionarioPaises[siglaPais] || siglaPais; 

     
        if (novoClima.cidade.includes(`, ${siglaPais}`)) {
          novoClima.cidade = novoClima.cidade.replace(`, ${siglaPais}`, `, ${paisTraduzido}`);
        } 
        else if (!novoClima.cidade.includes(paisTraduzido)) {
          novoClima.cidade = `${novoClima.cidade}, ${paisTraduzido}`;
        }
      }

      setClima(novoClima);
      
      await GerenciadorBanco.salvarCidade(novoClima.cidade);
      await atualizarListaHistorico();
    } catch (err) {
      setErro("Erro ao obter dados meteorológicos.");
    } finally {
      setCarregando(false);
    }
  };

  const buscarPorLocalizacao = async () => {
    setCarregando(true);
    setErro(null);

    if (Platform.OS === 'web') {
      if (!navigator.geolocation) {
        setErro("Geolocalização não suportada neste navegador.");
        setCarregando(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (posicao) => {
          const { latitude, longitude } = posicao.coords;
          await buscarPorCoordenadas(latitude, longitude, null);
        },
        (erroNavegador) => {
          if (erroNavegador.code === 1) {
            setErro("Permissão de localização negada no navegador.");
          } else if (erroNavegador.code === 2) {
            setErro("O dispositivo não conseguiu obter uma posição de GPS estável.");
          } else if (erroNavegador.code === 3) {
            setErro("Tempo limite esgotado. Tente novamente em um local aberto.");
          } else {
            setErro("Não foi possível obter a localização na Web.");
          }
          setCarregando(false);
        },
        { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 } 
      );
      return;
    }

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErro("Permissão de GPS negada.");
        setCarregando(false);
        return;
      }

      let localizacao = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = localizacao.coords;
      await buscarPorCoordenadas(latitude, longitude, null);
    } catch (err) {
      setErro("Não foi possível obter o sinal do GPS nativo.");
    } finally {
      setCarregando(false);
    }
  };

  return { clima, carregando, erro, historico, buscarCidade, buscarPorLocalizacao };
}