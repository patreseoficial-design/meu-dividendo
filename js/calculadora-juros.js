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
  // 1️⃣ Pega os valores dos inputs
  const ini = +document.getElementById('inicial').value;
  const men = +document.getElementById('mensal').value;
  let tx = +document.getElementById('taxa').value / 100;
  let meses = +document.getElementById('periodo').value;
  const tipoTaxa = document.getElementById('tipoTaxa').value;
  const tipoPeriodo = document.getElementById('tipoPeriodo').value;

  if (tipoTaxa === 'anual') tx = Math.pow(1 + tx, 1 / 12) - 1;
  if (tipoPeriodo === 'anos') meses *= 12;

  // 2️⃣ Inicializa variáveis de cálculo
  let reinv = ini;
  let sem = ini;
  let jurosReinv = 0;
  let jurosSem = 0;

  const tbody = document.querySelector('#tabela tbody');
  tbody.innerHTML = '';

  const labels = [], dataReinv = [], dataSem = [], dataJuros = [];

  // 3️⃣ Loop de cálculo mês a mês
  for (let i = 1; i <= meses; i++) {
    const jr = reinv * tx;
    reinv += jr + men;
    jurosReinv += jr;

    const js = ini * tx;
    sem += js + men;
    jurosSem += js;

    // Formata para exibir
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

  // 4️⃣ Atualiza resumo
atualizarResumo(ini, men, meses, jurosReinv, jurosSem, reinv, sem);

// 5️⃣ Mostra tabela, resumo e gráficos
document.getElementById('resultadoResumo').style.display = 'block';
document.getElementById('tabelaResultado').style.display = 'block';
document.getElementById('graficoComparativoBox').style.display = 'block';
document.getElementById('graficoJurosBox').style.display = 'block';

// 6️⃣ Cria/atualiza gráficos
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
  },
  options: { responsive: true, maintainAspectRatio: false }
});

graf2 = new Chart(document.getElementById('graficoJuros'), {
  type: 'bar',
  data: {
    labels,
    datasets: [
      { label: 'Juros recebidos por mês', data: dataJuros, backgroundColor: 'rgba(135, 206, 250, 0.8)' }
    ]
  },
  options: { responsive: true, maintainAspectRatio: false }
});
// ============================
// FUNÇÃO DE RESUMO COMPLETO
// ============================
function atualizarResumo(ini, men, meses, jurosReinv, jurosSem, reinv, sem) {
  const resumo = document.getElementById('resultadoResumo');
  resumo.style.display = 'block';

  const totalInvestido = ini + men * meses;

  document.getElementById('resTotalFinal').innerText = 
    `Valor Total Final (reinvestindo): R$ ${reinv.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} | Sem reinvestir: R$ ${sem.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  document.getElementById('resTotalInvestido').innerText = 
    `Valor Total Investido: R$ ${totalInvestido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  document.getElementById('resTotalJuros').innerText = 
    `Total em Juros (reinvestindo): R$ ${jurosReinv.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} | Sem reinvestir: R$ ${jurosSem.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}