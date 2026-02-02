// scripts/top.js
import fetch from "node-fetch";
import { ACOES, FIIS } from "./listas.js";

// Yahoo Finance endpoint
async function buscarYahoo(symbols) {
  const lista = symbols.join(",");
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${lista}.SA`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });

  const json = await res.json();
  return json.quoteResponse.result || [];
}

export default async function top(req, res) {
  try {
    // Busca tudo de uma vez
    const dadosAcoes = await buscarYahoo(ACOES);
    const dadosFiis = await buscarYahoo(FIIS);

    function normalizar(item) {
      return {
        symbol: item.symbol.replace(".SA", ""),
        price: item.regularMarketPrice ?? null,
        change: item.regularMarketChangePercent ?? null
      };
    }

    const acoes = dadosAcoes
      .filter(i => i.regularMarketChangePercent !== null)
      .map(normalizar);

    const fiis = dadosFiis
      .filter(i => i.regularMarketChangePercent !== null)
      .map(normalizar);

    // Ordenações
    const acoes_altas = [...acoes]
      .sort((a, b) => b.change - a.change)
      .slice(0, 10);

    const acoes_baixas = [...acoes]
      .sort((a, b) => a.change - b.change)
      .slice(0, 10);

    const fiis_altas = [...fiis]
      .sort((a, b) => b.change - a.change)
      .slice(0, 10);

    const fiis_baixas = [...fiis]
      .sort((a, b) => a.change - b.change)
      .slice(0, 10);

    res.json({
      acoes_altas,
      acoes_baixas,
      fiis_altas,
      fiis_baixas
    });

  } catch (e) {
    console.error("Erro TOP:", e);
    res.status(500).json({ erro: "Falha ao buscar tops" });
  }
}