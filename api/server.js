// api/server.js
import express from 'express';
import path from 'path';
import moedas from '../scripts/moedas.js';
import top from '../scripts/top.js';
import ativo from '../scripts/ativo.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Serve arquivos estáticos da raiz do projeto (index.html, style.css, script.js, logo.png)
app.use(express.static(path.resolve('../')));

// Rotas da API
app.get('/api/moedas', moedas);
app.get('/api/top', top);
app.get('/api/ativo/:symbol', ativo);

// Fallback para qualquer rota não reconhecida (opcional)
app.get('*', (req, res) => {
  res.sendFile(path.resolve('../index.html'));
});

// Inicia servidor
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));