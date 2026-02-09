// main.js

async function mostrarAtivo() {
  const params = new URLSearchParams(window.location.search);
  const ticker = params.get("ativo");
  if (!ticker) return alert("Nenhum ativo informado!");

  // Define a pasta (Ações ou Fiis)
  const tipo = ["Ações", "Fiis"];
  let ativoJson = null;

  for (const t of tipo) {
    try {
      const res = await fetch(`/dados/ativos/${t}/${ticker}.json`);
      if (!res.ok) continue;
      ativoJson = await res.json();
      break;
    } catch {}
  }

  if (!ativoJson) return alert("Ativo não encontrado!");

  // Nome do ativo
  document.getElementById("nomeAtivo").textContent = ativoJson.nome;

  // Cards principais
  const cardsDiv = document.getElementById("cards");
  cardsDiv.innerHTML = "";
  const cardsInfo = [
    {label:"Preço", value:`R$ ${ativoJson.preco_atual.valor}`},
    {label:"Variação", value:`${ativoJson.preco_atual.variacao_dia}%`},
    {label:"Máx/Mín", value:`R$ ${ativoJson.preco_atual.valor} / R$ ${ativoJson.preco_atual.valor}`}, // só exemplo
    {label:"Fonte", value: ativoJson.preco_atual.fonte}
  ];
  cardsInfo.forEach(i => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<strong>${i.label}</strong><br>${i.value}`;
    cardsDiv.appendChild(card);
  });

  // TODO: gráficos e dividendos
}

// Rodar ao carregar a página
window.addEventListener("DOMContentLoaded", mostrarAtivo);