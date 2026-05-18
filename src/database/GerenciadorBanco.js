import * as SQLite from 'expo-sqlite';

const banco = SQLite.openDatabaseSync('clima.db');

export const GerenciadorBanco = {
  configurarBanco: async () => {
    await banco.execAsync(`
      CREATE TABLE IF NOT EXISTS historico_busca (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_cidade TEXT NOT NULL UNIQUE
      );
    `);
  },

  salvarCidade: async (nome) => {
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

    const resultados = await banco.getAllAsync('SELECT nome_cidade FROM historico_busca ORDER BY id DESC');
    return resultados.map(row => row.nome_cidade);
  }
};