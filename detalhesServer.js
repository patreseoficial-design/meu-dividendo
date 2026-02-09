// detalhesServer.js
import express from "express";
import fetch from "node-fetch"; // versão 2.x

const app = express();
const PORT = process.env.PORT || 3000;

// Sua chave Brapi
const BRAPI_KEY = "kfWwE93iiUiHTg5V4XjbYR";

// Serve arquivos estáticos (detalhes.html, CSS, etc)
app.use(express.static("."));

// Endpoint para buscar dados do ativo
app.get("/api/ativo", async (req, res) => {
  const ticker = req.query.ativo;
  if (!ticker) return res.status(400).json({ error: "Nenhum ativo informado" });

  try {
    const url = `https://brapi.dev/api/quote/${ticker}?apikey=${BRAPI_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Erro ao acessar a Brapi");

    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      return res.status(404).json({ error: `Ativo "${ticker}" não encontrado na Brapi` });
    }

    const ativo = data.results[0];

    // Monta objeto para o front-end
    const resultado = {
      symbol: ativo.symbol,
      shortName: ativo.shortName,
      regularMarketPrice: ativo.regularMarketPrice,
      regularMarketChangePercent: ativo.regularMarketChangePercent,
      regularMarketVolume: ativo.regularMarketVolume,
      regularMarketOpen: ativo.regularMarketOpen,
      history: (ativo.history || []).map(h => ({
        date: h.date,
        close: h.close
      }))
    };

    res.json(resultado);

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erro ao carregar dados da Brapi: " + e.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});