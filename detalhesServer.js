import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// Sua chave da Brapi
const BRAPI_KEY = "kfWwE93iiUiHTg5V4XjbYR";

// Servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static("public"));

// Endpoint que retorna dados do ativo
app.get("/api/ativo", async (req, res) => {
  const ticker = req.query.ativo;
  if (!ticker) return res.status(400).json({ error: "Nenhum ativo informado" });

  try {
    const url = `https://brapi.dev/api/quote/${ticker}?apikey=${BRAPI_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.results || data.results.length === 0)
      return res.status(404).json({ error: `Ativo "${ticker}" não encontrado na Brapi.` });

    res.json(data.results[0]);
  } catch (e) {
    console.error("Erro ao buscar Brapi:", e);
    res.status(500).json({ error: "Erro ao buscar dados da Brapi" });
  }
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));