// main.js

// ====================== CONFIGURAÇÃO ======================
const DIAS_ATUALIZACAO = 5; // intervalos de atualização para Yahoo

// Pega ativo da URL
const params = new URLSearchParams(window.location.search);
const ativo = params.get("ativo");

if (!ativo) {
  alert("Nenhum ativo informado!");
} else {
  document.getElementById("nomeAtivo").textContent = ativo;
  carregarEExibirAtivo(ativo);
}

// ====================== FUNÇÕES ======================

// Pega JSON local do ativo
async function carregarJSONAtivo(tipo, ticker) {
  try {
    const res = await fetch(`../dados/ativos/${tipo === "acao" ? "Ações" : "Fiis"}/${ticker}.json`);
    return await res.json();
  } catch (err) {
    console.error("Erro ao carregar JSON do ativo:", ticker, err);
    return null;
  }
}

// Salva JSON atualizado no servidor (para Node.js/Render)
async function salvarJSONAtivo(tipo, ativoJson) {
  try {
    await fetch(`/atualizarAtivo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo, ativoJson })
    });
    console.log("✅ JSON salvo:", ativoJson.ticker);
  } catch (err) {
    console.error("Erro ao salvar JSON:", ativoJson.ticker, err);
  }
}

// Verifica se precisa atualizar (mais de 5 dias)
function precisaAtualizar(dataString) {
  if (!dataString) return true;
  const ultima = new Date(dataString);
  const hoje = new Date();
  const diff = (hoje - ultima) / (1000 * 60 * 60 * 24);
  return diff >= DIAS_ATUALIZACAO;
}

// ====================== BUSCA DE DADOS ======================

// 1️⃣ Pega valores ao vivo do Brapi
async function buscarBrapi(ticker) {
  try {
    const res = await fetch(`https://brapi.dev/api/quote/${ticker}?token=kfWwE93iiUiHTg5V4XjbYR`);
    const data = await res.json();
    return data.results[0];
  } catch (err) {
    console.error("Erro Brapi:", ticker, err);
    return null;
  }
}

// 2️⃣ Atualiza histórico e dividendos do Yahoo se necessário
async function atualizarYahoo(ativoJson) {
  const ticker = ativoJson.ticker;

  // Histórico de preços
  if (precisaAtualizar(ativoJson.historico_precos.ultima_atualizacao)) {
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
  }

  // Dividendos
  if (precisaAtualizar(ativoJson.dividendos.ultima_atualizacao)) {
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
  }

  return ativoJson;
}

// ====================== EXIBIÇÃO ======================
function preencherCards(stock) {
  const cardsDiv = document.getElementById("cards");
  cardsDiv.innerHTML = "";
  const cardsInfo = [
    { label: "Preço", value: `R$ ${stock.regularMarketPrice}` },
    { label: "Variação", value: `${stock.regularMarketChangePercent}%` },
    { label: "Máx/Mín", value: `R$ ${stock.regularMarketDayHigh} / R$ ${stock.regularMarketDayLow}` },
    { label: "Volume", value: stock.regularMarketVolume || "N/A" }
  ];
  cardsInfo.forEach(i => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<strong>${i.label}</strong><br>${i.value}`;
    cardsDiv.appendChild(card);
  });
}

function preencherHistorico(ativoJson) {
  const datas = ativoJson.historico_precos.dados.map(d => d.data);
  const precos = ativoJson.historico_precos.dados.map(d => d.close);
  const ctx = document.getElementById('precoChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: { labels: datas, datasets: [{ label: 'Preço', data: precos, borderColor: '#007bff', backgroundColor: 'rgba(0,123,255,0.1)' }] },
    options: { responsive: true, plugins: { legend: { display: true }, tooltip: { mode: 'index' } } }
  });
}

function preencherDividendos(ativoJson) {
  const tbody = document.querySelector("#dividendosTable tbody");
  tbody.innerHTML = "";
  ativoJson.dividendos.dados.forEach(div => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${div.data_ex}</td><td>${div.data_ex}</td><td>R$ ${div.valor}</td>`;
    tbody.appendChild(tr);
  });
}

function preencherIndicadores(ativoJson) {
  const indicadoresDiv = document.getElementById("indicadores");
  indicadoresDiv.innerHTML = "";
  const ind = ativoJson.indicadores;
  const cards = [
    { label: "P/VP", value: ind.pvp || "N/A" },
    { label: "DY 12m", value: ind.dy_12m || "N/A" },
    { label: "Patrimônio Líquido", value: ind.patrimonio_liquido || "N/A" },
    { label: "Valor de Mercado", value: ind.valor_mercado || "N/A" }
  ];
  cards.forEach(c => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<strong>${c.label}</strong><br>${c.value}`;
    indicadoresDiv.appendChild(card);
  });
}

// ====================== FLUXO PRINCIPAL ======================
async function carregarEExibirAtivo(ticker) {
  // Descobre se é ação ou FII
  const tipo = await fetch(`../dados/ativos/Ações/${ticker}.json`).then(r => r.ok ? "acao" : "fii").catch(() => "fii");

  // 1️⃣ Carrega JSON
  let ativoJson = await carregarJSONAtivo(tipo, ticker);

  // 2️⃣ Atualiza histórico, dividendos e indicadores do Yahoo (a cada 5 dias)
  ativoJson = await atualizarYahoo(ativoJson);
  salvarJSONAtivo(tipo, ativoJson); // envia para servidor

  // 3️⃣ Puxa preços ao vivo do Brapi
  const stock = await buscarBrapi(ticker);

  // 4️⃣ Exibe todos os dados na página
  if (stock) preencherCards(stock);
  preencherHistorico(ativoJson);
  preencherDividendos(ativoJson);
  preencherIndicadores(ativoJson);
}