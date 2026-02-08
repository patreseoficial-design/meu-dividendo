// MENU TOGGLE
window.toggleMenu = function() {
  const menu = document.getElementById('menuLinks');
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
};


// ================= Carregar moedas =================
async function carregarMoedas() {
  try {
    // API gratuita exemplo: https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,BTC-BRL,CNY-BRL
    const res = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,BTC-BRL,CNY-BRL');
    const data = await res.json();

    // Extrair valores de fechamento (last)
    const dolar = parseFloat(data['USDBRL'].ask);    // último preço do Dólar
    const euro = parseFloat(data['EURBRL'].ask);     // último preço do Euro
    const yuan = parseFloat(data['CNYBRL'].ask);     // último preço do Yuan
    const bitcoin = parseFloat(data['BTCBRL'].ask);  // último preço do Bitcoin

    // Atualiza o HTML
    document.getElementById('dolar-value').innerText = 'US$ ' + dolar.toFixed(2);
    document.getElementById('euro-value').innerText = '€ ' + euro.toFixed(2);
    document.getElementById('yuans-value').innerText = '¥ ' + yuan.toFixed(2);
    document.getElementById('bitcoin-value').innerText = '₿ ' + bitcoin.toLocaleString('pt-BR');
    
  } catch (erro) {
    console.error('Erro ao carregar moedas', erro);

    // Caso dê erro, mantém valores antigos ou mostra "não disponível"
    document.getElementById('dolar-value').innerText = 'US$ --';
    document.getElementById('euro-value').innerText = '€ --';
    document.getElementById('yuans-value').innerText = '¥ --';
    document.getElementById('bitcoin-value').innerText = '₿ --';
  }
}

// Chama a função quando a página carrega
window.addEventListener('load', carregarMoedas);



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
function toggleMenu() {
  const menu = document.getElementById('menuLinks');
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}
window.toggleMenu = toggleMenu;