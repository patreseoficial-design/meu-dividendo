// server.js
import express from 'express';
import moedas from './scripts/moedas.js';
import top from './scripts/top.js';
import ativo from './scripts/ativo.js'; // ou pesquisa.js se você renomeou

const app = express();
const PORT = 3000;

// Serve arquivos estáticos (index.html, style.css, script.js, logo.png, etc)
app.use(express.static('.'));

// Rotas da API
app.get('/api/moedas', moedas);
app.get('/api/top', top);
app.get('/api/ativo/:symbol', ativo);

// Inicia servidor
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));