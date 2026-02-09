// atualizarAtivos.js
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch"); // Node <18, se 18+ pode usar fetch nativo

// ===== Funções auxiliares =====

// Ler todos os arquivos JSON de uma pasta
function listarArquivosJSON(pasta) {
  return fs.readdirSync(pasta).filter(f => f.endsWith(".json"));
}

// Carregar ativo do arquivo
function carregarAtivoDoArquivo(tipo, ticker) {
  const pasta = tipo === "acao" ? "Ações" : "Fiis";
  const filePath = path.join(__dirname, "..", "dados", "ativos", pasta, `${ticker}.json`);
  if (!fs.existsSync(filePath)) throw new Error(`Arquivo ${ticker} não encontrado`);
  const rawData = fs.readFileSync(filePath, "utf8");
  return JSON.parse(rawData);
}

// Salvar ativo atualizado
function salvarAtivo(tipo, ativoJson) {
  const pasta = tipo === "acao" ? "Ações" : "Fiis";
  const filePath = path.join(__dirname, "..", "dados", "ativos", pasta, `${ativoJson.ticker}.json`);
  fs.writeFileSync(filePath, JSON.stringify(ativoJson, null, 2));
  console.log(`✅ Arquivo atualizado: ${ativoJson.ticker}`);
}

// Listar todos os ativos (Ações + Fiis)
function listarTodosAtivos() {
  const pastas = ["Ações", "Fiis"];
  let ativos = [];
  pastas.forEach(pasta => {
    const dir = path.join(__dirname, "..", "dados", "ativos", pasta);
    listarArquivosJSON(dir).forEach(file => {
      const tipo = pasta === "Ações" ? "acao" : "fii";
      ativos.push({ tipo, ticker: file.replace(".json", "") });
    });
  });
  return ativos;
}