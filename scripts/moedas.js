// scripts/moedas.js
import fetch from 'node-fetch';

export default async function moedas(req, res) {
  try {
    // Puxando valores das moedas do AwesomeAPI
    const r = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,CNY-BRL,BTC-BRL');
    const j = await r.json();

    res.json({
      dolar: parseFloat(j.USDBRL.bid),
      euro: parseFloat(j.EURBRL.bid),
      yuan: parseFloat(j.CNYBRL.bid),
      bitcoin: parseFloat(j.BTCBRL.bid),
      real: 1.00
    });
  } catch (e) {
    console.error('Erro ao buscar moedas', e);
    // Em caso de erro, envia valores padrão
    res.json({
      dolar: 0,
      euro: 0,
      yuan: 0,
      bitcoin: 0,
      real: 1.00
    });
  }
}