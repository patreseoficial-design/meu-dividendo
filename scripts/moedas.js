async function carregarMoedas() {
  try {
    const res = await fetch('/api/moedas');
    const m = await res.json();

    document.getElementById('dolar-value').innerText = 'US$ ' + m.dolar.toFixed(2);
    document.getElementById('euro-value').innerText = '€ ' + m.euro.toFixed(2);
    document.getElementById('yuans-value').innerText = '¥ ' + m.yuan.toFixed(2);
    document.getElementById('bitcoin-value').innerText = '₿ ' + m.bitcoin.toLocaleString('pt-BR');
  } catch (e) {
    console.error('Erro moedas', e);
  }
}