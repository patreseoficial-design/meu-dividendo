// server.js (NA RAIZ DO PROJETO)
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import moedas from './scripts/moedas.js';
import top from './scripts/top.js';
import ativo from './scripts/ativo.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Corrige __dirname no ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir arquivos estáticos (index.html, css, js, imagens)
app.use(express.static(__dirname));

// Rotas da API
app.get('/api/moedas', moedas);
app.get('/api/top', top);
app.get('/api/ativo/:symbol', ativo);

// Health check (teste rápido)
app.get('/api/status', (req, res) => {
  res.json({ ok: true });
});

// Start
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});