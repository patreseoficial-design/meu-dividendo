// scripts/ativo.js
import fetch from 'node-fetch';

const TOKEN = 'kfWwE93iiUiHTg5V4XjbYR';

// Ativos perenes fixos
const ATIVOS = [
  'CMIG4',
  'CPLE6',
  'TAEE11',
  'BBSE3',
  'SUZB3',
  'PETR4'
];

export default async function ativos(req, res) {
  try {
    const symbols = ATIVOS.join(',');
    const r = await fetch(
      `https://brapi.dev/api/quote/${symbols}?token=${TOKEN}`
    );
    const data = await r.json();

    const resultado = (data.results || []).map(a => ({
      symbol: a.symbol,
      price: a.regularMarketPrice,
      change: a.regularMarketChangePercent
    }));

    res.json(resultado);
  } catch (e) {
    console.error('Erro ativos perenes', e);

    // fallback para não quebrar o site
    res.json(
      ATIVOS.map(s => ({
        symbol: s,
        price: null,
        change: null
      }))
    );
  }
}