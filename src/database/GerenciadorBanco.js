import { Platform } from 'react-native'; 
import * as SQLite from 'expo-sqlite';


const banco = Platform.OS !== 'web' ? SQLite.openDatabaseSync('clima.db') : null;

export const GerenciadorBanco = {
  configurarBanco: async () => {

    if (Platform.OS === 'web') return;
    
    await banco.execAsync(`
      CREATE TABLE IF NOT EXISTS historico_busca (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_cidade TEXT NOT NULL UNIQUE
      );
    `);
  },

  salvarCidade: async (nome) => {

    if (Platform.OS === 'web') {
      try {
        let historico = JSON.parse(localStorage.getItem('historico_busca') || '[]');
        historico = historico.filter(cidade => cidade !== nome); 
        historico.unshift(nome); 
        historico = historico.slice(0, 4); 
        localStorage.setItem('historico_busca', JSON.stringify(historico));
      } catch (e) {
        console.error("Erro no localStorage da Web:", e);
      }
      return;
    }

l
    try {
      await banco.runAsync('DELETE FROM historico_busca WHERE nome_cidade = ?', [nome]);
      await banco.runAsync('INSERT INTO historico_busca (nome_cidade) VALUES (?)', [nome]);
      await banco.runAsync(`
        DELETE FROM historico_busca WHERE id NOT IN (
          SELECT id FROM historico_busca ORDER BY id DESC LIMIT 4
        )
      `);
    } catch (error) {
      console.error("Erro ao salvar histórico no SQLite:", error);
    }
  },

  buscarHistorico: async () => {

    if (Platform.OS === 'web') {
      try {
        return JSON.parse(localStorage.getItem('historico_busca') || '[]');
      } catch (e) {
        return [];
      }
    }

 
    const resultados = await banco.getAllAsync('SELECT nome_cidade FROM historico_busca ORDER BY id DESC');
    return resultados.map(row => row.nome_cidade);
  }
};