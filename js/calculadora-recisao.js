// -------------------- FUNÇÃO AUXILIAR FORMATAÇÃO --------------------
function formatBRL(valor) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

// -------------------- MENU HAMBÚRGUER --------------------
function toggleMenu() {
  const menu = document.getElementById('menuLinks');
  if (!menu) return;
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// -------------------- CALCULAR RESCISÃO --------------------
function calcularRescisao() {
  // ================= DADOS BÁSICOS =================
  const salario = Number(document.getElementById('salario')?.value) || 0;

  const admissaoInput = document.getElementById('admissao')?.value;
  const demissaoInput = document.getElementById('demissao')?.value;

  const admissao = new Date(admissaoInput);
  const demissao = new Date(demissaoInput);

  const tipoDemissao = document.getElementById('tipoDemissao')?.value;

  const avisoIndenizado =
    document.getElementById('avisoIndenizado')?.value === 'sim';

  const temFeriasVencidas =
    document.getElementById('feriasVencidas')?.value === 'sim';

  // ================= ADICIONAIS =================
  const periculosidadePerc =
    Number(document.getElementById('periculosidade')?.value) || 0;

  const insalubridadePerc =
    Number(document.getElementById('insalubridade')?.value) || 0;

  const horasExtras =
    Number(document.getElementById('horasExtras')?.value) || 0;

  // ================= VALIDAÇÕES =================
  if (!salario || !admissaoInput || !demissaoInput || isNaN(admissao) || isNaN(demissao)) {
    alert('Preencha todos os campos corretamente.');
    return;
  }

  if (demissao <= admissao) {
    alert('A data de demissão deve ser maior que a data de admissão.');
    return;
  }

  // >>> cálculos começam aqui

  // ================= ADICIONAIS =================
  const periculosidade = salario * (periculosidadePerc / 100);
  const insalubridade = salario * (insalubridadePerc / 100);
  const adicionais = periculosidade + insalubridade + horasExtras;
  const salarioBase = salario + adicionais;

  // ================= TEMPO TRABALHADO =================
  const totalDias = Math.floor((demissao - admissao) / (1000 * 60 * 60 * 24));
  const mesesTrabalhados = Math.floor(totalDias / 30);
  const diasRestantes = totalDias % 30;

  // ================= SALDO SALÁRIO =================
  const saldoSalario = (salarioBase / 30) * diasRestantes;

  // ================= AVISO PRÉVIO =================
  let avisoPrevio = 0;
  if (tipoDemissao === 'semJusta' && avisoIndenizado) {
    avisoPrevio = salarioBase;
  }

  // ================= FÉRIAS =================

// meses trabalhados no período atual
const mesesProporcionais = mesesTrabalhados % 12;

// férias vencidas (1 período, se marcado "Sim")
let feriasVencidas = 0;
if (document.getElementById('temFeriasVencidas')?.value === 'sim') {
  feriasVencidas = salarioBase * 1.3333;
}

// férias proporcionais + 1/3
const feriasProporcionais = (salarioBase / 12) * mesesProporcionais;
const feriasProporcionaisComTerco = feriasProporcionais * 1.3333;

// total de férias
const feriasComUmTerco =
  feriasVencidas + feriasProporcionaisComTerco;

  // ================= 13º =================
  let meses13 =
  (demissao.getFullYear() - admissao.getFullYear()) * 12 +
  (demissao.getMonth() - admissao.getMonth());

if (demissao.getDate() >= 15) {
  meses13 += 1;
}

if (meses13 > 12) meses13 = 12;
if (meses13 < 0) meses13 = 0;

const decimoTerceiro = (salarioBase / 12) * meses13;
// ================= FGTS (CORRETO) =================

// calcular meses completos entre admissão e demissão
let mesesFGTS =
  (demissao.getFullYear() - admissao.getFullYear()) * 12 +
  (demissao.getMonth() - admissao.getMonth());

// regra do FGTS: se trabalhou 15 dias ou mais no último mês, conta mais 1
if (demissao.getDate() >= 15) {
  mesesFGTS += 1;
}

// garantia mínima
if (mesesFGTS < 0) mesesFGTS = 0;

// FGTS = 8% do salário base (salário + adicionais) por mês
const fgts = salarioBase * 0.08 * mesesFGTS;

// multa de 40% apenas sem justa causa
const multaFGTS = tipoDemissao === 'semJusta' ? fgts * 0.4 : 0;
  
  // ================= INSS =================
  const baseINSS =
    saldoSalario + avisoPrevio + decimoTerceiro + feriasComUmTerco;

  let inss = 0;
  if (baseINSS <= 1320) inss = baseINSS * 0.075;
  else if (baseINSS <= 2571.29) inss = baseINSS * 0.09;
  else if (baseINSS <= 3856.94) inss = baseINSS * 0.12;
  else if (baseINSS <= 7507.49) inss = baseINSS * 0.14;
  else inss = 7507.49 * 0.14;

  // ================= IR =================
  const baseIR = baseINSS - inss;
  let ir = 0;
  if (baseIR > 1903.98 && baseIR <= 2826.65) ir = baseIR * 0.075 - 142.8;
  else if (baseIR <= 3751.05) ir = baseIR * 0.15 - 354.8;
  else if (baseIR <= 4664.68) ir = baseIR * 0.225 - 636.13;
  else if (baseIR > 4664.68) ir = baseIR * 0.275 - 869.36;
  if (ir < 0) ir = 0;

  // ================= TOTAL =================
  const totalLiquido =
    saldoSalario +
    avisoPrevio +
    feriasComUmTerco +
    decimoTerceiro +
    multaFGTS -
    inss -
    ir;

  // ================= EXIBIR RESULTADOS =================
  const resDiv = document.getElementById('resultadoRescisao');
  if (!resDiv) return;

  resDiv.style.display = 'block';

  document.getElementById('resSaldo').innerText = `Saldo de salário: ${formatBRL(saldoSalario)}`;
  document.getElementById('resAviso').innerText =
  `Aviso prévio: ${formatBRL(avisoPrevio)}`;

// ===== FÉRIAS VENCIDAS =====
const elFeriasVencidas = document.getElementById('resFeriasVencidas');

if (elFeriasVencidas) {
  if (feriasVencidas > 0) {
    elFeriasVencidas.style.display = 'block';
    elFeriasVencidas.innerText =
      `Férias vencidas + 1/3: ${formatBRL(feriasVencidas)}`;
  } else {
    elFeriasVencidas.style.display = 'none';
  }
}

// ===== FÉRIAS PROPORCIONAIS =====
document.getElementById('resFerias').innerText =
  `Férias proporcionais + 1/3: ${formatBRL(feriasProporcionaisComTerco)}`;
  document.getElementById('res13').innerText = `13º proporcional: ${formatBRL(decimoTerceiro)}`;
  document.getElementById('resFGTS').innerText = `FGTS: ${formatBRL(fgts)}`;
  document.getElementById('resMulta').innerText = `Multa FGTS (40%): ${formatBRL(multaFGTS)}`;
  document.getElementById('resINSS').innerText = `Desconto INSS: ${formatBRL(inss)}`;
  document.getElementById('resIR').innerText = `Desconto IRRF: ${formatBRL(ir)}`;
  document.getElementById('resTotal').innerText = `Total líquido: ${formatBRL(totalLiquido)}`;
  
  // ================= GRÁFICO =================
  const canvas = document.getElementById('graficoRescisao');
  if (!canvas || typeof Chart === 'undefined') return;

  const ctx = canvas.getContext('2d');
  if (window.graficoRescisao) window.graficoRescisao.destroy();

  window.graficoRescisao = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Saldo', 'Aviso', 'Férias', '13º', 'Adicionais', 'FGTS', 'Multa FGTS', 'INSS', 'IR'],
      datasets: [{
        label: 'Valores (R$)',
        data: [
          saldoSalario,
          avisoPrevio,
          feriasComUmTerco,
          decimoTerceiro,
          adicionais,
          fgts,
          multaFGTS,
          inss,
          ir
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });
}