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

// Health checkd
app.get('/api/status', (req, res) => {
  res.json({ ok: true });
});

// Start
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// ======================
// --- BRAPI
const BRAPI_KEY = "kfWwE93iiUiHTg5V4XjbYR";

app.get('/api/ativos', async (req, res) => {
  const symbol = req.query.symbol;
  if(!symbol) return res.status(400).json({ error: "symbol não informado" });

  try {
    const brapiRes = await fetch(`https://brapi.dev/api/quote/${symbol}?apikey=${BRAPI_KEY}`);
    const data = await brapiRes.json();
    if(!data.results || data.results.length === 0) return res.status(404).json({ error: "ativo não encontrado" });

    res.json(data.results[0]);
  } catch(e) {
    console.error(e);
    res.status(500).json({ error: "erro ao buscar na Brapi" });
  }
});