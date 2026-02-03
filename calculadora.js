// Limpa todos os inputs quando a página carregar
window.onload = () => {
  document.querySelectorAll("input").forEach(i => i.value = "");
  document.getElementById('resultado-calculo').innerHTML = "";
};

let graf1, graf2;

function calcular() {
  // Pegando os valores dos inputs pelo ID
  const ini = +document.getElementById('inicial').value;
  const men = +document.getElementById('mensal').value;
  let tx = +document.getElementById('taxa').value / 100;
  let meses = +document.getElementById('periodo').value;
  const tipoTaxa = document.getElementById('tipoTaxa').value;
  const tipoPeriodo = document.getElementById('tipoPeriodo').value;

  // Ajusta taxa e período para mensal
  if(tipoTaxa === 'anual') tx = Math.pow(1 + tx, 1/12) - 1;
  if(tipoPeriodo === 'anos') meses *= 12;

  // Inicializa variáveis para cálculo
  let reinv = ini;  // montante reinvestindo
  let sem = ini;    // montante sem reinvestir
  let jurosReinv = 0;
  let jurosSem = 0;

  const tbody = document.querySelector('#tabela tbody');
  tbody.innerHTML = '';

  const labels = [], dataReinv = [], dataSem = [], dataJuros = [];

  // Loop de cálculo mês a mês
  for(let i=1; i<=meses; i++){
    const jr = reinv * tx;      // juros reinvestindo
    reinv += jr + men;
    jurosReinv += jr;

    const js = ini * tx;        // juros sem reinvestir
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

  // Calcula resumo final
  const montante = reinv;
  const totalInvestido = ini + men * meses;
  const totalJuros = montante - totalInvestido;

  // MOSTRA CAIXA DE RESUMO
  const res = document.getElementById('resultadoResumo');
  res.style.display = 'block';
  document.getElementById('resTotalFinal').innerText = `Valor Total Final: R$ ${montante.toFixed(2)}`;
  document.getElementById('resTotalInvestido').innerText = `Valor Total Investido: R$ ${totalInvestido.toFixed(2)}`;
  document.getElementById('resTotalJuros').innerText = `Total em Juros: R$ ${totalJuros.toFixed(2)}`;

  // MOSTRA TABELA DETALHADA
  document.getElementById('resultado').style.display = 'block';

  // ATUALIZA GRÁFICOS
  if(graf1) graf1.destroy();
  if(graf2) graf2.destroy();

  graf1 = new Chart(document.getElementById('graficoComparativo'), {
    type: 'line',
    data: {
      labels,
      datasets: [
        {label:'Reinvestindo', data:dataReinv, borderWidth:2, borderColor:'#111', fill:false},
        {label:'Sem Reinvestir', data:dataSem, borderWidth:2, borderColor:'#888', fill:false}
      ]
    }
  });

  graf2 = new Chart(document.getElementById('graficoJuros'), {
    type:'bar',
    data:{
      labels,
      datasets:[
        {label:'Juros recebidos por mês', data:dataJuros, backgroundColor:'#111'}
      ]
    }
  });
}

  