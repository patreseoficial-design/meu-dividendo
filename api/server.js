import express from 'express';
import moedas from './moedas.js';
import top from './top.js';
import ativo from './ativo.js';

const app = express();
app.use(express.static('../')); // serve index.html, script.js e style.css

app.get('/api/moedas', moedas);
app.get('/api/top', top);
app.get('/api/ativo/:symbol', ativo);

app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));