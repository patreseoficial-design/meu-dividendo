import express from 'express';
import moedas from '../scripts/moedas.js';
import top from '../scripts/top.js';
import ativo from '../scripts/pesquisa.js';

const app = express();
app.use(express.static('../')); // serve index.html e assets

app.get('/api/moedas', moedas);
app.get('/api/top', top);
app.get('/api/ativo/:symbol', ativo);

app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));