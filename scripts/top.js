// scripts/top.js
import fetch from 'node-fetch';

const API_KEY = 'O78K51WkaV2DJHslEqkqtw8Tvx24kfm1';

function filtrarBrasil(lista) {
  return lista
    .filter(a => a.symbol && a.symbol.endsWith('.SA'))
    .slice(0, 10)
    .map(a => ({
      symbol: a.symbol.replace('.SA', ''),
      price: a.price,
      change: a.changesPercentage
        ? parseFloat(a.changesPercentage.replace('%', ''))
        : null
    }));
}

export default async function top(req, res) {
  try {
    const url = `https://financialmodelingprep.com/api/v3/stock_market/gainers?apikey=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    const brasil = filtrarBrasil(data);

    res.json({
      acoes_altas: brasil
    });

  } catch (err) {
    console.error('Erro TOP Brasil:', err);
    res.status(500).json({ error: 'Erro ao buscar TOP Brasil' });
  }
}