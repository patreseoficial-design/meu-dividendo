import fetch from 'node-fetch';

const TOKEN = 'kfWwE93iiUiHTg5V4XjbYR'; // Seu token BRAPI

export default async function top(req, res) {
  try {
    // Símbolos para top Ações e FIIs
    const acoesSymbols = ['PETR4', 'VALE3', 'ITUB4', 'BBDC4', 'ABEV3', 'BBAS3', 'WEGE3', 'ELET3', 'GGBR4', 'SUZB3'];
    const fiisSymbols = ['HGLG11', 'MXRF11', 'KNRI11', 'VISC11', 'XPLG11', 'BCFF11', 'IRDM11', 'HGRE11', 'RECT11', 'RBRF11'];

    const fetchData = async (symbols) => {
      const url = `https://brapi.dev/api/v2/quote?symbol=${symbols.join(',')}&apikey=${TOKEN}`;
      const r = await fetch(url);
      const j = await r.json();
      return j.results.map(i => ({
        codigo: i.symbol,
        preco: i.regularMarketPrice?.toFixed(2),
        variacao: i.regularMarketChangePercent?.toFixed(2)
      }));
    }

    const acoes = await fetchData(acoesSymbols);
    const fiis = await fetchData(fiisSymbols);

    res.json({
      acoes_altas: acoes.filter(i => i.variacao > 0).slice(0,10),
      acoes_baixas: acoes.filter(i => i.variacao < 0).slice(0,10),
      fiis_altas: fiis.filter(i => i.variacao > 0).slice(0,10),
      fiis_baixas: fiis.filter(i => i.variacao < 0).slice(0,10)
    });

  } catch(e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao buscar tops' });
  }
}