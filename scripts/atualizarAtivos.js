
// atualizarAtivos.js
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch"); // Node 18+ já tem fetch nativo

// ====================== Funções utilitárias ======================
function carregarAtivoDoArquivo(tipo, ticker) {
  const pasta = tipo === "acao" ? "Ações" : "Fiis";
  const filePath = path.join(__dirname, "..", "dados", "ativos", pasta, `${ticker}.json`);
  if (!fs.existsSync(filePath)) throw new Error(`Arquivo do ativo ${ticker} não encontrado`);
  const rawData = fs.readFileSync(filePath, "utf8");
  return JSON.parse(rawData);
}

function salvarAtivo(tipo, ativoJson) {
  const pasta = tipo === "acao" ? "Ações" : "Fiis";
  const filePath = path.join(__dirname, "..", "dados", "ativos", pasta, `${ativoJson.ticker}.json`);
  fs.writeFileSync(filePath, JSON.stringify(ativoJson, null, 2));
  console.log(`✅ ${ativoJson.ticker} atualizado e salvo.`);
}

// ====================== Atualização Brapi ======================
async function atualizarBrapi(ativoJson) {
  const ticker = ativoJson.ticker;
  try {
    const res = await fetch(`https://brapi.dev/api/quote/${ticker}?token=kfWwE93iiUiHTg5V4XjbYR`);
    const data = await res.json();
    const stock = data.results[0];
    if (!stock) return ativoJson;

    // Preço
    ativoJson.preco_atual = {
      valor: stock.regularMarketPrice,
      variacao_dia: stock.regularMarketChangePercent,
      atualizado_em: new Date().toISOString().split("T")[0],
      fonte: "brapi"
    };

    // Indicadores
    const finRes = await fetch(`https://brapi.dev/api/stock/financials?symbol=${ticker}&token=kfWwE93iiUiHTg5V4XjbYR`);
    const finData = await finRes.json();
    if (finData.results && finData.results.length > 0) {
      const f = finData.results[0];
      ativoJson.indicadores = {
        pvp: f.priceBook || null,
        dy_12m: f.dividendYield || null,
        patrimonio_liquido: f.totalEquity || null,
        valor_mercado: f.marketCap || null,
        fonte: "brapi"
      };
    }

  } catch (err) {
    console.error("Erro Brapi:", ticker, err);
  }
  return ativoJson;
}

// ====================== Atualização Yahoo ======================
async function atualizarYahoo(ativoJson) {
  const ticker = ativoJson.ticker;

  // Histórico de preços
  try {
    const resPreco = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}.SA?range=1y&interval=1d`);
    const dataPreco = await resPreco.json();
    const result = dataPreco.chart.result[0];
    const timestamps = result.timestamp;
    const closes = result.indicators.quote[0].close;

    ativoJson.historico_precos.dados = timestamps.map((t, i) => ({
      data: new Date(t * 1000).toISOString().split("T")[0],
      close: closes[i]
    }));
    ativoJson.historico_precos.ultima_atualizacao = new Date().toISOString().split("T")[0];
    ativoJson.historico_precos.fonte = "yahoo";
  } catch (err) {
    console.error("Erro Yahoo Preço:", ticker, err);
  }

  // Dividendos
  try {
    const resDiv = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}.SA?range=5y&interval=1d`);
    const dataDiv = await resDiv.json();
    const events = dataDiv.chart.result[0].events?.dividends || {};
    ativoJson.dividendos.dados = Object.keys(events).map(key => ({
      data_ex: events[key].date ? new Date(events[key].date * 1000).toISOString().split("T")[0] : null,
      valor: events[key].amount
    }));
    ativoJson.dividendos.ultima_atualizacao = new Date().toISOString().split("T")[0];
    ativoJson.dividendos.fonte = "yahoo";
  } catch (err) {
    console.error("Erro Yahoo Dividendos:", ticker, err);
  }

  return ativoJson;
}

// ====================== Loop de atualização ======================
async function atualizarAtivoCompleto(tipo, ticker) {
  let ativo = carregarAtivoDoArquivo(tipo, ticker);
  ativo = await atualizarBrapi(ativo);
  ativo = await atualizarYahoo(ativo);
  salvarAtivo(tipo, ativo);
}

// ====================== Rodar para teste ======================
const ativosParaAtualizar = [
  {tipo: "fii", ticker: "MXRF11"},
  {tipo: "acao", ticker: "PETR4"} // só exemplo, adicione mais
];

(async () => {
  for (let a of ativosParaAtualizar) {
    await atualizarAtivoCompleto(a.tipo, a.ticker);
  }
})();