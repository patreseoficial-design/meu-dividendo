async function carregarTop() {
  const res = await fetch('/api/top');
  const data = await res.json();
  
  const map = [
    ['acoes_altas','acoesAltas'],
    ['acoes_baixas','acoesBaixas'],
    ['fiis_altas','fiisAltas'],
    ['fiis_baixas','fiisBaixas']
  ];

  map.forEach(([api, id]) => {
    const el = document.getElementById(id);
    el.innerHTML = '';
    el.className = 'grid';
    data[api].forEach(i => {
      el.innerHTML += `
        <div class="card">
          <strong>${i.codigo}</strong>
          <span>R$ ${i.preco} (${i.variacao}%)</span>
        </div>
      `;
    });
  });
}