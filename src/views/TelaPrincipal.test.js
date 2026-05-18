import React from 'react';
import { render } from '@testing-library/react-native';
import TelaPrincipal from './TelaPrincipal'; 
import { useClimaViewModel } from '../viewmodels/ClimaViewModel'; 

// Mock do ViewModel para isolar o teste
jest.mock('../viewmodels/ClimaViewModel', () => ({
  useClimaViewModel: jest.fn(),
}));

describe('Testes da Tela Principal', () => {
  it('deve verificar se a temperatura exibida na tela é um valor numérico', () => {
    
    // Injeta os dados controlados no Mock
    useClimaViewModel.mockReturnValue({
      clima: {
        cidade: 'Cabaceiras do Paraguaçu, BR',
        temperatura: 23, 
        sensacaoTermica: 24,
        umidade: 86,
        descricao: 'Nublado'
      },
      carregando: false,
      erro: null,
      historico: [],
      buscarCidade: jest.fn(),
      buscarPorLocalizacao: jest.fn(),
    });

    // 1. Desestrutura o getAllByText para gerenciar múltiplos elementos iguais
    const { getAllByText } = render(<TelaPrincipal />);

    // 2. Captura todos os componentes que possuem "°C" na tela
    const componentesComGraus = getAllByText(/°C/);
    
    // 3. Pegamos o primeiro item da lista [0], que é a nossa Temperatura Principal
    const componenteTemperatura = componentesComGraus[0];
    const textoExibido = componenteTemperatura.props.children;
    
    // Transforma o texto (ex: "23°C") em número puro (ex: 23)
    const valorConvertido = parseFloat(textoExibido);

    // Asserções para garantir que a saída é estritamente numérica e válida
    expect(valorConvertido).not.toBeNaN();
    expect(typeof valorConvertido).toBe('number');
    expect(valorConvertido).toBe(23); 
  });
});