const { fiis, acoes } = require("./config/ativos");
const rasparFII = require("./scrapers/fii");
const rasparAcao = require("./scrapers/acao");

(async () => {
  console.log("🔄 Iniciando coleta...\n");

  for (const fii of fiis) {
    const dados = await rasparFII(fii.ticker, fii.url);
    console.log("FII:", dados);
  }

  for (const acao of acoes) {
    const dados = await rasparAcao(acao.ticker, acao.url);
    console.log("AÇÃO:", dados);
  }

  console.log("\n✅ Finalizado");
})();