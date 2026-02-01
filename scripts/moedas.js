import fetch from 'node-fetch';

const TOKEN = 'kfWwE93iiUiHTg5V4XjbYR'; // Seu token BRAPI

export default async function moedas(req, res) {
  try {
    const symbols = ['USD/BRL', 'EUR/BRL', 'CNY/BRL', 'BTC/BRL'];
    const results = {};

    for (let s of symbols) {
      const url = `https://brapi.dev/api/v2/quote?symbol=${s}&apikey=${TOKEN}`;
      const r = await fetch(url);
      const j = await r.json();
      const quote = j.results[0];
      results[s.split('/')[0].toLowerCase()] = quote?.regularMarketPrice || 0;
    }

    res.json(results);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao buscar moedas' });
  }
}