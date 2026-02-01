async function carregarMoedas() {
  try {
    const moedas = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,CNY-BRL,BTC-BRL');
    const m = await moedas.json();

    const map = [
      ['USDBRL','dolar-value','US$'],
      ['EURBRL','euro-value','€'],
      ['CNYBRL','yuans-value','¥'],
      ['BTCBRL','bitcoin-value','₿']
    ];

    map.forEach(([key,id,simb])=>{
      const el = document.getElementById(id);
      if(el) el.innerText = `${simb} ${Number(m[key].bid).toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2})}`;
    });
    document.getElementById('real-value').innerText = 'R$ 1,00';
  } catch(e){ console.error('Erro moedas',e); }
}

async function carregarTop() {
  const res = await fetch('/api/top');
  const data = await res.json();

  const map = [
    ['acoes_altas','acoesAltas'],
    ['acoes_baixas','acoesBaixas'],
    ['fiis_altas','fiisAltas'],
    ['fiis_baixas','fiisBaixas']
  ];

  map.forEach(([api,id])=>{
    const el = document.getElementById(id);
    if(!el) return;
    el.innerHTML = '';
    // Cards 5 por linha
    data[api].forEach((i,idx)=>{
      el.innerHTML += `<div class="card">
        <strong>${i.codigo}</strong><br>
        R$ ${i.preco}<br>
        ${i.variacao}%</div>`;
      if((idx+1)%5===0) el.innerHTML += '<br>';
    });
  });

  // Propaganda entre ações e FIIs
  const prop = document.getElementById('propaganda');
  if(prop) prop.innerHTML = '<div style="text-align:center;padding:10px;background:#000;color:#fff;margin:10px 0;">📢 Sua propaganda aqui</div>';
}

carregarMoedas();
carregarTop();
