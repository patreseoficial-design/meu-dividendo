import express from 'express';
import fetch from 'node-fetch';
const app = express();
const PORT = 3000;

app.use(express.static('.'));

const TOKEN = 'kfWwE93iiUiHTg5V4XjbYR'; // seu token BRAPI

async function getMoedas() {
  const res = await fetch(`https://brapi.dev/api/v2/currency?base=USD&token=${TOKEN}`);
  const dataUSD = await res.json();
  const resBTC = await fetch(`https://brapi.dev/api/v2/quote?symbols=BTC&token=${TOKEN}`);
  const dataBTC = await resBTC.json();
  return {
    dolar: dataUSD.results[0].ask,
    euro: dataUSD.results.find(c=>c.shortName==='EUR')?.ask,
    yuan: dataUSD.results.find(c=>c.shortName==='CNY')?.ask,
    bitcoin: dataBTC.results[0].regularMarketPrice
  };
}

app.get('/api/moedas', async (req,res)=>{
  try{
    const m = await getMoedas();
    res.json(m);
  }catch(e){ res.status(500).json({erro:'Falha moedas'}) }
});

app.get('/api/top', async (req,res)=>{
  try{
    const r = await fetch(`https://brapi.dev/api/market-summary?token=${TOKEN}`);
    const data = await r.json();
    const acoesAltas = data.stocks.sort((a,b)=>b.regularMarketChangePercent-a.regularMarketChangePercent).slice(0,10);
    const acoesBaixas = data.stocks.sort((a,b)=>a.regularMarketChangePercent-b.regularMarketChangePercent).slice(0,10);
    const fiisAltas = data.funds.sort((a,b)=>b.regularMarketChangePercent-a.regularMarketChangePercent).slice(0,10);
    const fiisBaixas = data.funds.sort((a,b)=>a.regularMarketChangePercent-b.regularMarketChangePercent).slice(0,10);
    res.json({acoes_altas:acoesAltas,acoes_baixas:acoesBaixas,fiis_altas:fiisAltas,fiis_baixas:fiisBaixas});
  }catch(e){ res.status(500).json({erro:'Falha top'}) }
});

app.get('/api/ativo/:symbol', async (req,res)=>{
  try{
    const symbol=req.params.symbol;
    const r = await fetch(`https://brapi.dev/api/quote/${symbol}?token=${TOKEN}`);
    const data = await r.json();
    res.json(data.results[0]||{});
  }catch(e){ res.status(500).json({erro:'Falha ativo'}) }
});

app.listen(PORT,()=>console.log(`Servidor rodando em http://localhost:${PORT}`));
