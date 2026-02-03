// Limpa todos os inputs quando a página carregar
window.onload = () => {
  document.querySelectorAll("input").forEach(i => i.value = "");
  document.getElementById('resultado-calculo').innerHTML = "";
};

function calcular() {
  const ini = +inicial.value;
  const men = +mensal.value;
  let tx = +taxa.value / 100;
  let meses = +periodo.value;

  // Ajusta taxa e período para mensal
  if(tipoTaxa.value === 'anual') tx = Math.pow(1 + tx, 1/12) - 1;
  if(tipoPeriodo.value === 'anos') meses *= 12;

  let montante = ini;
  let totalInvestido = ini;
  let totalJuros = 0;

  const tbody = document.querySelector('#tabela tbody');
  tbody.innerHTML = '';

  const labels = [], dataReinv = [], dataSem = [], dataJuros = [];
  let reinv = ini;
  let sem = ini;
  let jurosReinv = 0;
  let jurosSem = 0;

  for(let i=1;i<=meses;i++){
    // Reinvestindo
    const jr = reinv * tx;
    reinv += jr + men;
    jurosReinv += jr;

    // Sem reinvestir
    const js = ini * tx;
    sem += js + men;
    jurosSem += js;

    // Preenche tabela detalhada
    tbody.innerHTML += `
      <tr>
        <td>${i}</td>
        <td>R$ ${jr.toFixed(2)}</td>
        <td>R$ ${reinv.toFixed(2)}</td>
        <td>R$ ${js.toFixed(2)}</td>
        <td>R$ ${sem.toFixed(2)}</td>
      </tr>`;

    labels.push(i);
    dataReinv.push(reinv);
    dataSem.push(sem);
    dataJuros.push(jr);
  }

  montante = reinv;
  totalInvestido = ini + men * meses;
  totalJuros = montante - totalInvestido;

  // Mostra caixa de resumo
const res = document.getElementById('resultadoResumo');
res.style.display = 'block';
document.getElementById('resTotalFinal').innerText = `Valor Total Final: R$ ${montante.toFixed(2)}`;
document.getElementById('resTotalInvestido').innerText = `Valor Total Investido: R$ ${totalInvestido.toFixed(2)}`;
document.getElementById('resTotalJuros').innerText = `Total em Juros: R$ ${totalJuros.toFixed(2)}`;

  // Atualiza gráficos
  if(graf1) graf1.destroy();
  if(graf2) graf2.destroy();

  graf1 = new Chart(graficoComparativo,{
    type:'line',
    data:{
      labels,
      datasets:[
        {label:'Reinvestindo', data:dataReinv, borderWidth:2},
        {label:'Sem Reinvestir', data:dataSem, borderWidth:2}
      ]
    }
  });

  graf2 = new Chart(graficoJuros,{
    type:'bar',
    data:{
      labels,
      datasets:[
        {label:'Juros recebidos por mês', data:dataJuros}
      ]
    }
  });
}