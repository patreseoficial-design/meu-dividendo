// scripts/moedas.js
import fetch from 'node-fetch';

export default async function moedas(req, res) {
  try {
    // Pegar moedas fiat
    const response = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=BRL,EUR,CNY');
    const data = await response.json();

    let dolar = data.rates.BRL || 5.10;   // fallback se mercado fechado
    let euro = data.rates.EUR || 1.00;    // fallback
    let yuan = data.rates.CNY || 6.50;    // fallback

    // Bitcoin
    const btcRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=brl');
    const btcData = await btcRes.json();
    let bitcoin = btcData.bitcoin?.brl || 120000; // fallback

    // Envia resposta
    res.json({
      dolar: parseFloat(dolar.toFixed(2)),
      euro: parseFloat(euro.toFixed(2)),
      yuan: parseFloat(yuan.toFixed(2)),
      bitcoin: parseFloat(bitcoin.toFixed(2)),
      real: 1.00
    });

  } catch (e) {
    console.error('Erro ao buscar moedas', e);
    // Em caso de erro geral, envia fallback seguro
    res.json({
      dolar: 5.10,
      euro: 1.00,
      yuan: 6.50,
      bitcoin: 120000,
      real: 1.00
    });
  }
}