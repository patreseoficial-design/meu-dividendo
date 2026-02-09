import fetch from 'node-fetch';

const TOKEN = 'kfWwE93iiUiHTg5V4XjbYR'; // Seu token BRAPI

export default async function ativo(req, res) {
  try {
    const symbol = req.params.symbol;
    const url = `https://brapi.dev/api/v2/quote?symbol=${symbol}&apikey=${TOKEN}`;
    const r = await fetch(url);
    const j = await r.json();
    const data = j.results[0];

    if(!data) return res.status(404).json({ error: 'Ativo não encontrado' });

    res.json({
      symbol: data.symbol,
      regularMarketPrice: data.regularMarketPrice,
      regularMarketChangePercent: data.regularMarketChangePercent,
      type: data.type,
      dividendYield: data.dividendYield,
      lastDividendValue: data.lastDividendValue
    });
  } catch(e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao buscar ativo' });
  }
}