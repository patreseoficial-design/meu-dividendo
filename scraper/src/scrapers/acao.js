const axios = require("axios");
const cheerio = require("cheerio");
const { salvarPatrimonio, salvarDividendo } = require("../services/salvarDados");

async function rasparAcao(ticker) {
  const url = `https://statusinvest.com.br/acoes/${ticker}`;
  const { data } = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0" }
  });

  const $ = cheerio.load(data);

  salvarPatrimonio({
    ticker,
    tipo: "ACAO",
    patrimonio_liquido: $('[title="Patrimônio Líquido"]').text().trim(),
    valor_patrimonial: $('[title="Valor Patrimonial por Ação"]').text().trim(),
    pvp: $('[title="P/VP"]').text().trim()
  });

  $("#earning-section table tbody tr").each((_, el) => {
    const td = $(el).find("td");

    salvarDividendo({
      ticker,
      tipo: "ACAO",
      data_base: $(td[0]).text().trim(),
      data_pagamento: $(td[1]).text().trim(),
      valor: $(td[2]).text().trim()
    });
  });

  console.log(`✔ Ação ${ticker}`);
}

module.exports = { rasparAcao };