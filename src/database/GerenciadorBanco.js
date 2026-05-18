import { Platform } from 'react-native';

let banco = null;


if (Platform.OS !== 'web') {
  try {
    const SQLite = require('expo-sqlite');
    banco = SQLite.openDatabaseSync('clima.db');
  } catch (e) {
    console.error("Erro ao inicializar o SQLite nativo:", e);
  }
}

export const GerenciadorBanco = {
  configurarBanco: async () => {
    if (Platform.OS === 'web') {

      return true;
    }
    
    if (banco) {
      await banco.execAsync(`
        CREATE TABLE IF NOT EXISTS historico (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          cidade TEXT UNIQUE
        );
      `);
    }
  },

  salvarCidade: async (nomeCidade) => {
    if (!nomeCidade) return;

    if (Platform.OS === 'web') {

      let historico = JSON.parse(localStorage.getItem('historico') || '[]');
      historico = historico.filter(c => c !== nomeCidade);
      historico.unshift(nomeCidade);
      if (historico.length > 4) historico.pop();
      localStorage.setItem('historico', JSON.stringify(historico));
      return;
    }

    if (banco) {

      await banco.runAsync('DELETE FROM historico WHERE cidade = ?;', [nomeCidade]);
      await banco.runAsync('INSERT INTO historico (cidade) VALUES (?);', [nomeCidade]);
      

      await banco.runAsync(`
        DELETE FROM historico WHERE id NOT IN (
          SELECT id FROM historico ORDER BY id DESC LIMIT 4
        );
      `);
    }
  },

  buscarHistorico: async () => {
    if (Platform.OS === 'web') {
      return JSON.parse(localStorage.getItem('historico') || '[]');
    }

    if (banco) {
      const resultados = await banco.getAllAsync('SELECT cidade FROM historico ORDER BY id DESC LIMIT 4;');
      return resultados.map(row => row.cidade);
    }
    
    return [];
  }
};