async function buscarAtivo() {
  const symbol = document.getElementById('searchInput').value.toUpperCase();
  if (!symbol) return;

  const res = await fetch('/api/ativo/' + symbol);
  const data = await res.json();

  const r = document.getElementById('resultado');
  r.innerHTML = `
    <h3>${data.symbol || 'Não encontrado'}</h3>
    <p>Preço: R$ ${data.regularMarketPrice?.toFixed(2)}</p>
    <p>Variação: ${data.regularMarketChangePercent?.toFixed(2)}%</p>
    <p>Tipo: ${data.type}</p>
    <p>Dividend Yield: ${data.dividendYield || '-'}</p>
    <p>Último Dividendo: ${data.lastDividendValue || '-'}</p>
  `;
}