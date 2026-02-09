const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch"); // Node 18+ pode usar fetch nativo

// PASTAS
const pastas = {
  acao: "Ações",
  fii: "Fiis"
};

// FUNÇÃO: carregar ativo do JSON
function carregarAtivoDoArquivo(tipo, ticker) {
  const pasta = pastas[tipo];
  const filePath = path.join(__dirname, "..", "dados", "ativos", pasta, `${ticker}.json`);
  if (!fs.existsSync(filePath)) {
    console.warn(`Arquivo do ativo ${ticker} não encontrado em ${filePath}`);
    return null;
  }
  const rawData = fs.readFileSync(filePath, "utf8");
  return JSON.parse(rawData);
}

// FUNÇÃO: salvar JSON atualizado
function salvarAtivo(tipo, ativoJson) {
  const pasta = pastas[tipo];
  const filePath = path.join(__dirname, "..", "dados", "ativos", pasta, `${ativoJson.ticker}.json`);
  fs.writeFileSync(filePath, JSON.stringify(ativoJson, null, 2));
  console.log(`Arquivo atualizado: ${filePath}`);
}

// FUNÇÃO: atualizar preço e indicadores via Brapi
async function atualizarBrapi(ativoJson) {
  try {
    const res = await fetch(`https://brapi.dev/api/quote/${ativoJson.ticker}?token=kfWwE93iiUiHTg5V4XjbYR`);
    const data = await res.json();
    const stock = data.results[0];
    if (!stock) return;

    ativoJson.preco_atual = {
      valor: stock.regularMarketPrice,
      variacao_dia: stock.regularMarketChangePercent,
      atualizado_em: new Date().toISOString().split("T")[0],
      fonte: "brapi"
    };

    ativoJson.indicadores = {
      pvp: stock.priceBook || null,
      dy_12m: stock.dividendYield || null,
      patrimonio_liquido: stock.totalEquity || null,
      valor_mercado: stock.marketCap || null,
      fonte: "brapi"
    };
  } catch (err) {
    console.error(`Erro Brapi ${ativoJson.ticker}:`, err);
  }
}

// FUNÇÃO: atualizar histórico de preços e dividendos via Yahoo
async function atualizarYahoo(ativoJson) {
  const tickerYahoo = ativoJson.ticker + ".SA"; // para ativos B3

  // Histórico de preços 1 ano
  try {
    const resPreco = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${tickerYahoo}?range=1y&interval=1d`);
    const dataPreco = await resPreco.json();
    if (dataPreco.chart && dataPreco.chart.result) {
      const result = dataPreco.chart.result[0];
      const timestamps = result.timestamp;
      const closes = result.indicators.quote[0].close;

      ativoJson.historico_precos = {
        dados: timestamps.map((t, i) => ({
          data: new Date(t * 1000).toISOString().split("T")[0],
          close: closes[i]
        })),
        ultima_atualizacao: new Date().toISOString().split("T")[0],
        fonte: "yahoo"
      };
    }
  } catch (err) {
    console.error(`Erro Yahoo Preço ${ativoJson.ticker}:`, err);
  }

  // Dividendos 5 anos
  try {
    const resDiv = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${tickerYahoo}?range=5y&interval=1d`);
    const dataDiv = await resDiv.json();
    if (dataDiv.chart && dataDiv.chart.result) {
      const events = dataDiv.chart.result[0].events?.dividends || {};
      ativoJson.dividendos = {
        dados: Object.keys(events).map(key => ({
          data_ex: events[key].date ? new Date(events[key].date * 1000).toISOString().split("T")[0] : null,
          valor: events[key].amount
        })),
        ultima_atualizacao: new Date().toISOString().split("T")[0],
        fonte: "yahoo"
      };
    }
  } catch (err) {
    console.error(`Erro Yahoo Dividendos ${ativoJson.ticker}:`, err);
  }
}

// FUNÇÃO PRINCIPAL: percorre todos os ativos
async function atualizarTodosAtivos() {
  for (const tipo of Object.keys(pastas)) {
    const pasta = path.join(__dirname, "..", "dados", "ativos", pastas[tipo]);
    const arquivos = fs.readdirSync(pasta).filter(f => f.endsWith(".json"));

    for (const arquivo of arquivos) {
      const ticker = arquivo.replace(".json", "");
      const ativo = carregarAtivoDoArquivo(tipo, ticker);
      if (!ativo) continue;

      console.log(`Atualizando ${ativo.ticker}...`);
      await atualizarBrapi(ativo);
      await atualizarYahoo(ativo);
      salvarAtivo(tipo, ativo);
    }
  }
}

// Roda tudo
atualizarTodosAtivos().then(() => console.log("Todos ativos atualizados!"));