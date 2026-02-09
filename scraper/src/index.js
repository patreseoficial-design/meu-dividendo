const { fiis, acoes } = require("./config/ativos");
const { rasparFII } = require("./scrapers/fii");
const { rasparAcao } = require("./scrapers/acao");

async function iniciar() {
  for (const fii of fiis) {
    await rasparFII(fii);
  }

  for (const acao of acoes) {
    await rasparAcao(acao);
  }

  console.log("✅ Scraping finalizado");
}

iniciar();