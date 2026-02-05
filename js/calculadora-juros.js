// ============================
// MENU HAMBURGUER
// ============================
function toggleMenu() {
  const menu = document.getElementById('menuLinks');
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// ============================
// VARIÁVEIS GLOBAIS DE GRÁFICOS
// ============================
let graf1, graf2;

function calcular() {
  // PEGANDO OS ELEMENTOS
  const ini = +document.getElementById('inicial').value;
  const men = +document.getElementById('mensal').value;
  let tx = +document.getElementById('taxa').value / 100;
  let meses = +document.getElementById('periodo').value;
  const tipoTaxa = document.getElementById('tipoTaxa').value;
  const tipoPeriodo = document.getElementById('tipoPeriodo').value;

  // AJUSTA TAXA E PERÍODO PARA MENSAL
  if (tipoTaxa === 'anual') tx = Math.pow(1 + tx, 1 / 12) - 1;
  if (tipoPeriodo === 'anos') meses *= 12;

  // VARIÁVEIS
  let reinv = ini;
  let sem = ini;
  let jurosReinv = 0;
  let jurosSem = 0;

  const tbody = document.querySelector('#tabela tbody');
  tbody.innerHTML = '';

  const labels = [], dataReinv = [], dataSem = [], dataJuros = [];

  for (let i = 1; i <= meses; i++) {
    const jr = reinv * tx; // juros reinvestindo
    reinv += jr + men;
    jurosReinv += jr;

    const js = ini * tx; // juros sem reinvestir
    sem += js + men;
    jurosSem += js;

    // Tabela detalhada
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

  // RESUMO
  const totalInvestido = ini + men * meses;
  const montante = reinv;
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
  if (graf1) graf1.destroy();
  if (graf2) graf2.destroy();

atualizarResumo(ini, men, meses, jurosReinv, jurosSem, reinv, sem);

  // GRÁFICO COMPARATIVO - LINHA
  graf1 = new Chart(document.getElementById('graficoComparativo'), {
    type: 'line',
    data: {
      labels,
      datasets: [
        { label: 'Reinvestindo', data: dataReinv, borderWidth: 2, borderColor: '#FF69B4', fill: false }, // rosa
        { label: 'Sem Reinvestir', data: dataSem, borderWidth: 2, borderColor: '#1E90FF', fill: false } // azul
      ]
    }
  });

  // GRÁFICO DE JUROS - BARRA
  graf2 = new Chart(document.getElementById('graficoJuros'), {
    type:'bar',
    data:{
      labels,
      datasets:[
        { label:'Juros recebidos por mês', data:dataJuros, backgroundColor: 'rgba(135, 206, 250, 0.8)' } // azul claro
      ]
    }
  });
}
function atualizarResumo(ini, men, meses, jurosReinv, jurosSem, reinv, sem) {
  // Seleciona o container do resumo
  const resumo = document.getElementById('resultadoResumo');
  
  // Mostra o resumo
  resumo.style.display = 'block';

  // Calcula valor total investido (capital inicial + somatório dos aportes)
  const totalInvestido = ini + men * meses;

  // Preenche os campos do resumo
  document.getElementById('resTotalFinal').innerText = 
    `Total final (reinvestindo): R$ ${reinv.toFixed(2)} | Sem reinvestir: R$ ${sem.toFixed(2)}`;
  
  document.getElementById('resTotalInvestido').innerText = 
    `Total investido: R$ ${totalInvestido.toFixed(2)}`;
  
  document.getElementById('resTotalJuros').innerText = 
    `Juros recebidos: R$ ${jurosReinv.toFixed(2)} | Sem reinvestir: R$ ${jurosSem.toFixed(2)}`;
}