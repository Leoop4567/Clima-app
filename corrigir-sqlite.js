const fs = require('fs');
const path = require('path');

// Caminho do arquivo interno do Expo que está sem a extensão .js
const arquivo = path.join(__dirname, 'node_modules', 'expo-sqlite', 'build', 'index.js');

if (fs.existsSync(arquivo)) {
  let conteudo = fs.readFileSync(arquivo, 'utf8');
  
  // Se encontrar a importação incompleta, injeta o .js nela
  if (conteudo.includes("./SQLiteDatabase") && !conteudo.includes("./SQLiteDatabase.js")) {
    conteudo = conteudo.replace("./SQLiteDatabase", "./SQLiteDatabase.js");
    fs.writeFileSync(arquivo, conteudo, 'utf8');
    console.log("Bug de importação do expo-sqlite corrigido com sucesso para o Node 20!");
  }
}