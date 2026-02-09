const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./dados.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS dividendos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticker TEXT,
      tipo TEXT,
      data_base TEXT,
      data_pagamento TEXT,
      valor TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS patrimonio (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticker TEXT,
      tipo TEXT,
      patrimonio_liquido TEXT,
      valor_patrimonial TEXT,
      pvp TEXT,
      atualizado_em TEXT
    )
  `);
});

module.exports = db;