async function pegarSalarioMinimoAtual() {
  try {
    // Série do salário mínimo (nominal) no Ipeadata
    const url = "https://www.ipeadata.gov.br/api/odata4/ValoresSerie(SERCODIGO='MTE12_SALMIN12')";
    const resposta = await fetch(url);
    const dados = await resposta.json();

    const series = dados.value || [];

    // Pega o ano atual
    const now = new Date();
    const anoAtual = now.getFullYear();

    // Ordena por data decrescente
    series.sort((a, b) => new Date(b.VALDATA) - new Date(a.VALDATA));

    // Pega valor do ano atual, se disponível
    const itemAnoAtual = series.find(item => new Date(item.VALDATA).getFullYear() === anoAtual);

    if (itemAnoAtual) return +itemAnoAtual.VALVALOR;

    // Se não tiver, pega o valor mais recente
    if (series.length > 0) return +series[0].VALVALOR;

    return null;
  } catch (erro) {
    console.error("Erro ao buscar salário mínimo:", erro);
    return null;
  }
}

async function calcularPIS() {
  // Pegar dados do usuário
  const salarioUsuario = +document.getElementById('salarioPIS').value || 0;
  const meses = +document.getElementById('mesesPIS').value || 0;

  if (meses < 1 || meses > 12) {
    alert('Informe corretamente os meses trabalhados (1 a 12).');
    return;
  }

  const salarioMinimo = await pegarSalarioMinimoAtual();

  if (!salarioMinimo) {
    alert("Não foi possível obter o salário mínimo automaticamente.");
    return;
  }

  // Verifica se ganha até 2 salários mínimos
  if (salarioUsuario > salarioMinimo * 2) {
    document.getElementById('resultadoPIS').style.display = 'block';
    document.getElementById('resultadoPIS').style.border = '2px solid #111';
    document.getElementById('resultadoPIS').style.backgroundColor = '#f9f9f9';
    document.getElementById('resultadoPIS').style.padding = '10px';
    document.getElementById('resultadoPIS').style.borderRadius = '5px';
    document.getElementById('resTotalPIS').innerText = 
      `Você não tem direito ao PIS, pois seu salário ultrapassa 2 salários mínimos.`;
    return;
  }

  // Calcula PIS proporcional
  const valorPIS = salarioMinimo * (meses / 12);

  // Mostra resultado
  const res = document.getElementById('resultadoPIS');
  res.style.display = 'block';
  res.style.border = '2px solid #111';
  res.style.backgroundColor = '#f9f9f9';
  res.style.padding = '10px';
  res.style.borderRadius = '5px';

  document.getElementById('resTotalPIS').innerText = 
    `Salário mínimo atual: R$ ${salarioMinimo.toFixed(2)}
Valor do PIS proporcional: R$ ${valorPIS.toFixed(2)}`;
}