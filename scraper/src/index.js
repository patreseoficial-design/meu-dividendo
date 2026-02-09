const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("🚀 Scraper Meu Dividendo ONLINE");
});

app.get("/teste", (req, res) => {
  res.json({
    status: "ok",
    ativo: "MXRF11",
    mensagem: "API online funcionando"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});