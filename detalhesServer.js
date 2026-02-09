// detalhesServer.js
import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// Sua chave da Brapi
const BRAPI_KEY = "kfWwE93iiUiHTg5V4XjbYR";

// Permitir que o HTML acesse via fetch (CORS)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// Endpoint que recebe o ticker e retorna os dados da Brapi
app.get("/api/ativo", async (req, res) => {
  const ticker = req.query.ativo;
  if (!ticker) return res.status(400).json({ error: "Nenhum ativo informado" });

  const url = `https://brapi.dev/api/quote/${ticker}?apikey=${BRAPI_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erro ao acessar Brapi (${response.status})`);

    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      return res.status(404).json({ error: `Ativo "${ticker}" não encontrado na Brapi.` });
    }

    res.json(data.results[0]); // retorna apenas o ativo
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// Servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static("public"));

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});