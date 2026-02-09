// server.js (RAIZ DO PROJETO)
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import moedas from './scripts/moedas.js';
import top from './scripts/top.js';
import pesquisa from './scripts/pesquisa.js';
import ativos from './scripts/ativo.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Corrige __dirname no ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Arquivos estáticos
app.use(express.static(__dirname));

// Rotas da API
app.get('/api/moedas', moedas);
app.get('/api/top', top);
app.get('/api/pesquisa/:symbol', pesquisa);
app.get('/api/ativos', ativos); // <<< ATIVOS PERENES

// Health check
app.get('/api/status', (req, res) => {
  res.json({ ok: true });
});

// Start
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// server.js
import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// Sua chave da Brapi
const BRAPI_KEY = "kfWwE93iiUiHTg5V4XjbYR";

// Pasta pública para servir HTML, CSS, JS
app.use(express.static("public"));

// Endpoint para buscar dados de um ativo
app.get("/api/ativo/:ticker", async (req, res) => {
  const ticker = req.params.ticker.toUpperCase();

  let ativo = null;

  // Primeiro tenta pegar dados da Brapi
  try {
    const brapiUrl = `https://brapi.dev/api/quote/${ticker}?apikey=${BRAPI_KEY}`;
    const response = await fetch(brapiUrl);
    const data = await response.json();

    if (data && data.results && data.results.length > 0) {
      const r = data.results[0];

      ativo = {
        ticker: r.symbol,
        nome: r.shortName ?? r.symbol,
        preco_atual: {
          valor: r.regularMarketPrice ?? null,
          variacao_dia: r.regularMarketChangePercent ?? null,
        },
        historico_precos: {
          dados: (r.history?.slice(-10) || []).map(h => ({
            data: h.date,
            close: h.close,
          })),
        },
        dividendos: {
          dados: (r.dividends?.map(d => ({
            data_ex: d.exDate,
            payDate: d.payDate,
            valor: d.value,
          })) || []),
        },
        indicadores: {
          pvp: r.pv ?? null,
          dy_12m: r.dividendYield ?? null,
          patrimonio_liquido: r.netAssetValue ?? null,
          valor_mercado: r.marketCap ?? null,
        },
        patrimonio_carteira: null, // se você quiser preencher depois
      };
    }
  } catch (e) {
    console.error("Erro Brapi:", e.message);
  }

  if (!ativo) {
    return res.status(404).json({ error: `Ativo "${ticker}" não encontrado na Brapi.` });
  }

  res.json(ativo);
});

// Start server
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});