// scripts/moedas.js
import fetch from 'node-fetch';

export default async function moedas(req, res) {
  try {
    // Puxando USD, EUR, CNY em relação ao BRL
    const r = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=BRL,EUR,CNY');
    const j = await r.json();

    // Bitcoin separado usando CoinGecko (gratuito e sem token)
    const rBTC = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=brl');
    const jBTC = await rBTC.json();

    res.json({
      dolar: parseFloat(j.rates.BRL.toFixed(2)),
      euro: parseFloat((j.rates.EUR ? 1 / j.rates.EUR * j.rates.BRL : 0).toFixed(2)), 
      yuan: parseFloat((j.rates.CNY ? 1 / j.rates.CNY * j.rates.BRL : 0).toFixed(2)),
      bitcoin: parseFloat(jBTC.bitcoin.brl),
      real: 1.00
    });

  } catch (e) {
    console.error('Erro ao buscar moedas', e);
    res.json({
      dolar: 0,
      euro: 0,
      yuan: 0,
      bitcoin: 0,
      real: 1.00
    });
  }
}