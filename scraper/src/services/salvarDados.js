const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("dados.db");

function salvarPatrimonio(dados) {
  db.run(`
    INSERT INTO patrimonio
    (ticker, tipo, patrimonio_liquido, valor_patrimonial, pvp, atualizado_em)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [
    dados.ticker,
    dados.tipo,
    dados.patrimonio_liquido,
    dados.valor_patrimonial,
    dados.pvp,
    new Date().toISOString()
  ]);
}

function salvarDividendo(d) {
  db.run(`
    INSERT INTO dividendos
    (ticker, tipo, data_base, data_pagamento, valor)
    VALUES (?, ?, ?, ?, ?)
  `, [
    d.ticker,
    d.tipo,
    d.data_base,
    d.data_pagamento,
    d.valor
  ]);
}

module.exports = {
  salvarPatrimonio,
  salvarDividendo
};