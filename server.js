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