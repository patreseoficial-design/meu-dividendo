// scripts/ativo.js
import fetch from 'node-fetch';

const TOKEN = 'kfWwE93iiUiHTg5V4XjbYR'; // SEU TOKEN BRAPI

export default async function ativo(req, res) {
  try {
    const symbol = req.params.symbol.toUpperCase();

    const url = `https://brapi.dev/api/quote/${symbol}?token=${TOKEN}`;

    const r = await fetch(url);
    const j = await r.json();

    if (!j.results || j.results.length === 0) {
      return res.status(404).json({ erro: 'Ativo não encontrado' });
    }

    const a = j.results[0];

    res.json({
      symbol: a.symbol,
      nome: a.longName || a.shortName,
      preco: a.regularMarketPrice,
      variacao: a.regularMarketChange,
      variacaoPercentual: a.regularMarketChangePercent,
      tipo: a.type,
      dividendYield: a.dividendYield || 0,
      ultimoDividendo: a.lastDividendValue || 0
    });

  } catch (e) {
    console.error('Erro ao buscar ativo:', e);
    res.status(500).json({ erro: 'Falha ao buscar ativo' });
  }
}