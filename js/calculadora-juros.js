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


// ============================
// FUNÇÃO PRINCIPAL DE CÁLCULO
// ============================
function calcular() {
const ini = +document.getElementById('inicial').value;
const men = +document.getElementById('mensal').value;
let tx = +document.getElementById('taxa').value / 100;
let meses = +document.getElementById('periodo').value;
const tipoTaxa = document.getElementById('tipoTaxa').value;
const tipoPeriodo = document.getElementById('tipoPeriodo').value;

if (tipoTaxa === 'anual') tx = Math.pow(1 + tx, 1 / 12) - 1;
if (tipoPeriodo === 'anos') meses *= 12;

let reinv = ini;
let sem = ini;
let jurosReinv = 0;
let jurosSem = 0;

const tbody = document.querySelector('#tabela tbody');
tbody.innerHTML = '';

const labels = [], dataReinv = [], dataSem = [], dataJuros = [];

for (let i = 1; i <= meses; i++) {
  const jr = reinv * tx;
  reinv += jr + men;
  jurosReinv += jr;

  const js = ini * tx;
  sem += js + men;
  jurosSem += js;

  // Formata para exibir com vírgula
  const jrExibir = jr.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const reinvExibir = reinv.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const jsExibir = js.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const semExibir = sem.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  tbody.innerHTML += `
    <tr>
      <td>${i}</td>
      <td>R$ ${jrExibir}</td>
      <td>R$ ${reinvExibir}</td>
      <td>R$ ${jsExibir}</td>
      <td>R$ ${semExibir}</td>
    </tr>
  `;

  labels.push(i);
  dataReinv.push(reinv);
  dataSem.push(sem);
  dataJuros.push(jr);
}

atualizarResumo(ini, men, meses, jurosReinv, jurosSem, reinv, sem);

document.getElementById('resultado').style.display = 'block';
   
  
    
    

  // ============================
  // ATUALIZA GRÁFICOS
  // ============================
  if (graf1) graf1.destroy();
  if (graf2) graf2.destroy();

  graf1 = new Chart(document.getElementById('graficoComparativo'), {
    type: 'line',
    data: {
      labels,
      datasets: [
        { label: 'Reinvestindo', data: dataReinv, borderWidth: 2, borderColor: '#FF69B4', fill: false },
        { label: 'Sem Reinvestir', data: dataSem, borderWidth: 2, borderColor: '#1E90FF', fill: false }
      ]
    }
  });

  graf2 = new Chart(document.getElementById('graficoJuros'), {
    type:'bar',
    data:{
      labels,
      datasets:[
        { label:'Juros recebidos por mês', data:dataJuros, backgroundColor: 'rgba(135, 206, 250, 0.8)' }
      ]
    }
  });
}

// ============================
// FUNÇÃO DE RESUMO COMPLETO
// ============================
function atualizarResumo(ini, men, meses, jurosReinv, jurosSem, reinv, sem) {
  const resumo = document.getElementById('resultadoResumo');
  resumo.style.display = 'block';

  const totalInvestido = ini + men * meses;

  document.getElementById('resTotalFinal').innerText = 
    `Valor Total Final (reinvestindo): R$ ${reinv.toFixed(2)} | Sem reinvestir: R$ ${sem.toFixed(2)}`;

  document.getElementById('resTotalInvestido').innerText = 
    `Valor Total Investido: R$ ${totalInvestido.toFixed(2)}`;

  document.getElementById('resTotalJuros').innerText = 
    `Total em Juros (reinvestindo): R$ ${jurosReinv.toFixed(2)} | Sem reinvestir: R$ ${jurosSem.toFixed(2)}`;
}