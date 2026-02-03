// MENU TOGGLE
function toggleMenu() {
  const menu = document.querySelector('.nav-menu');
  menu.classList.toggle('show');
}

// Carregar moedas
async function carregarMoedas() {
  try {
    const res = await fetch('/api/moedas');
    const m = await res.json();
    document.getElementById('dolar-value').innerText = 'US$ ' + m.dolar.toFixed(2);
    document.getElementById('euro-value').innerText = '€ ' + m.euro.toFixed(2);
    document.getElementById('yuans-value').innerText = '¥ ' + m.yuan.toFixed(2);
    document.getElementById('bitcoin-value').innerText = '₿ ' + m.bitcoin.toLocaleString('pt-BR');
  } catch (e) { console.error('Erro moedas', e); }
}

// Carregar tops (ações e FIIs)
async function carregarTop() {
  try {
    const res = await fetch('/api/top');
    const data = await res.json();
    const map = [
      ['acoes_altas', 'acoesAltas'],
      ['acoes_baixas', 'acoesBaixas'],
      ['fiis_altas', 'fiisAltas'],
      ['fiis_baixas', 'fiisBaixas']
    ];

    map.forEach(([api, id]) => {
      const el = document.getElementById(id);
      el.innerHTML = '';
      if (data[api]) data[api].forEach(i => {
        el.innerHTML += `
          <div class="card">
            <strong>${i.symbol || i.codigo}</strong>
            <span>R$ ${i.regularMarketPrice?.toFixed(2) || i.preco} (${i.regularMarketChangePercent?.toFixed(2) || i.variacao}%)</span>
          </div>
        `;
      });
    });
  } catch (e) { console.error('Erro tops', e); }
}

// Buscar ativo pela barra de pesquisa
async function buscarAtivo() {
  const symbol = document.getElementById('searchInput').value.toUpperCase();
  if (!symbol) return;
  const res = await fetch('/api/ativos/' + symbol);
  if (res.status !== 200) {
    document.getElementById('resultado').innerHTML = '<p>Ativo não encontrado</p>';
    return;
  }
  const data = await res.json();
  const r = document.getElementById('resultado');
  r.innerHTML = `
    <h3>${data.symbol}</h3>
    <p>Preço: R$ ${data.regularMarketPrice?.toFixed(2)}</p>
    <p>Variação: ${data.regularMarketChangePercent?.toFixed(2)}%</p>
    <p>Tipo: ${data.type}</p>
    <p>Dividend Yield: ${data.dividendYield || '-'}</p>
    <p>Último Dividendo: ${data.lastDividendValue || '-'}</p>
  `;
}

// EXECUTA AO CARREGAR A PÁGINA
window.addEventListener('DOMContentLoaded', () => {
  carregarMoedas();
  carregarTop();
});