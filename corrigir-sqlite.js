const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'node_modules', 'expo-sqlite');

if (fs.existsSync(baseDir)) {
  // 1. Garante que a pasta build existe
  const buildDir = path.join(baseDir, 'build');
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
  }

  // 2. Neutraliza o index.js e o SQLiteDatabase.js transformando-os em objetos vazios
  fs.writeFileSync(path.join(buildDir, 'index.js'), 'module.exports = {};', 'utf8');
  fs.writeFileSync(path.join(buildDir, 'SQLiteDatabase.js'), 'module.exports = {};', 'utf8');

  // 3. Neutraliza o arquivo de manifesto que força o link de plugins nativos de celular
  const configJson = path.join(baseDir, 'expo-module.config.json');
  if (fs.existsSync(configJson)) {
    fs.writeFileSync(configJson, '{}', 'utf8');
  }

  console.log(" [Vercel Patch] Módulo expo-sqlite neutralizado com sucesso para build Web!");
}