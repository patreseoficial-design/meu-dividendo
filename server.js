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
// <!-- brapi -->
// Rota para detalhes de um ativo via Brapi
// ======================
import fetch from 'node-fetch';

app.get('/api/ativo/:ticker', async (req, res) => {
  const ticker = req.params.ticker.toUpperCase();
  const brapiKey = process.env.BRAPI_KEY || "kfWwE93iiUiHTg5V4XjbYR"; // chave do servidor

  try {
    const response = await fetch(`https://brapi.dev/api/quote/${ticker}?apikey=${brapiKey}`);
    if (!response.ok) throw new Error("Erro ao acessar Brapi");

    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      return res.status(404).json({ error: `Ativo "${ticker}" não encontrado na Brapi.` });
    }

    // Retorna apenas o ativo
    res.json(data.results[0]);

  } catch (e) {
    console.error("Erro Brapi:", e);
    res.status(500).json({ error: "Erro ao buscar dados do servidor" });
  }
});