// scripts/moedas.js
import fetch from 'node-fetch';

export default async function moedas(req, res) {
  try {
    // Pega câmbio USD, EUR, CNY em relação ao BRL
    const response = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=BRL,EUR,CNY');
    const data = await response.json();

    const dolar = data.rates.BRL;      // USD → BRL
    const euro = data.rates.EUR;       // USD → EUR
    const yuan = data.rates.CNY;       // USD → CNY

    // Pega preço do Bitcoin em BRL via CoinGecko
    const btcRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=brl');
    const btcData = await btcRes.json();
    const bitcoin = btcData.bitcoin.brl;

    res.json({
      dolar: parseFloat(dolar.toFixed(2)),
      euro: parseFloat(euro.toFixed(2)),
      yuan: parseFloat(yuan.toFixed(2)),
      bitcoin: parseFloat(bitcoin.toFixed(2)),
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