import fetch from "node-fetch";
import { ACOES, FIIS } from "./listas.js";

const APIKEY = "SUA_API_AQUI";

async function buscarAtivo(symbol){
  const url = `https://financialmodelingprep.com/api/v3/quote/${symbol}.SA?apikey=${APIKEY}`;
  const r = await fetch(url);
  const j = await r.json();
  return j[0];
}

async function processar(lista){
  const dados = [];

  for(const s of lista){
    try{
      const a = await buscarAtivo(s);
      if(!a) continue;

      dados.push({
        symbol: s,
        price: a.price,
        change: a.changesPercentage,
        volume: a.volume,
        liquidez: a.price * a.volume
      });
    }catch{}
  }

  return dados;
}

export default async function top(req,res){
  const acoes = await processar(ACOES);
  const fiis  = await processar(FIIS);

  res.json({
    acoes_altas: [...acoes].sort((a,b)=>b.change - a.change).slice(0,10),
    acoes_baixas: [...acoes].sort((a,b)=>a.change - b.change).slice(0,10),

    acoes_liquidas: [...acoes].sort((a,b)=>b.liquidez - a.liquidez).slice(0,10),
    acoes_iliquidas: [...acoes].sort((a,b)=>a.liquidez - b.liquidez).slice(0,10),

    fiis_liquidos: [...fiis].sort((a,b)=>b.liquidez - a.liquidez).slice(0,10),
    fiis_iliquidos: [...fiis].sort((a,b)=>a.liquidez - b.liquidez).slice(0,10)
  });
}