const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch"); // Se Node 18+, pode usar fetch nativo

// Função para carregar JSON do ativo
function carregarAtivoDoArquivo(tipo, ticker) {
  const pasta = tipo === "acao" ? "Ações" : "Fiis";
  // Ajuste: sobe uma pasta porque estamos em Scripts/
  const filePath = path.join(__dirname, "..", "dados", "ativos", pasta, `${ticker}.json`);
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`Arquivo do ativo ${ticker} não encontrado em ${filePath}`);
  }
  
  const rawData = fs.readFileSync(filePath, "utf8");
  return JSON.parse(rawData);
}

// Função para salvar JSON atualizado
function salvarAtivo(tipo, ativoJson) {
  const pasta = tipo === "acao" ? "Ações" : "Fiis";
  const filePath = path.join(__dirname, "..", "dados", "ativos", pasta, `${ativoJson.ticker}.json`);
  fs.writeFileSync(filePath, JSON.stringify(ativoJson, null, 2));
  console.log(`Arquivo atualizado salvo: ${filePath}`);
}

// Teste de leitura
const ticker = "MXRF11";
const tipo = "fii"; // ou "acao"

let ativo = carregarAtivoDoArquivo(tipo, ticker);
console.log("Ativo carregado:", ativo.ticker, ativo.nome);