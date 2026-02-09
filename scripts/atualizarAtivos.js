async function atualizarHistoricoEDividendosYahoo(ativoJson) {
  const ticker = ativoJson.ticker;

  // 1️⃣ Histórico de preços pelo Yahoo Finance (1 ano diário)
  try {
    const resPreco = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}.SA?range=1y&interval=1d`);
    const dataPreco = await resPreco.json();
    
    if (dataPreco.chart && dataPreco.chart.result) {
      const result = dataPreco.chart.result[0];
      const timestamps = result.timestamp;
      const closes = result.indicators.quote[0].close;

      ativoJson.historico_precos.dados = timestamps.map((t, i) => ({
        data: new Date(t*1000).toISOString().split('T')[0],
        close: closes[i]
      }));

      ativoJson.historico_precos.ultima_atualizacao = new Date().toISOString().split('T')[0];
      ativoJson.historico_precos.fonte = "yahoo";
      console.log(`Histórico de preços do Yahoo atualizado para ${ticker}.`);
    }
  } catch (err) {
    console.error("Erro ao buscar histórico do Yahoo:", err);
  }

  // 2️⃣ Dividendos pelo Yahoo Finance
  try {
    const resDiv = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}.SA?range=5y&interval=1d`);
    const dataDiv = await resDiv.json();

    if (dataDiv.chart && dataDiv.chart.result) {
      const events = dataDiv.chart.result[0].events?.dividends || {};

      ativoJson.dividendos.dados = Object.keys(events).map(key => ({
        data_ex: events[key].date ? new Date(events[key].date*1000).toISOString().split('T')[0] : null,
        valor: events[key].amount
      }));

      ativoJson.dividendos.ultima_atualizacao = new Date().toISOString().split('T')[0];
      ativoJson.dividendos.fonte = "yahoo";
      console.log(`Dividendos do Yahoo atualizados para ${ticker}.`);
    }
  } catch (err) {
    console.error("Erro ao buscar dividendos do Yahoo:", err);
  }

  return ativoJson;
}

// Exemplo de uso
carregarAtivoBrapi("MXRF11", "fii", "Maxi Renda FII")
  .then(ativo => atualizarHistoricoEDividendosYahoo(ativo))
  .then(ativoAtualizado => console.log(ativoAtualizado));