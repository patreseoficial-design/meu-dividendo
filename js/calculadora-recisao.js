<script>
// ================= FUNÇÃO AUXILIAR =================
function formatBRL(valor) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

// ================= MENU =================
function toggleMenu() {
  const menu = document.getElementById('menuLinks');
  if (!menu) return;
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// ================= CÁLCULO DE MESES =================
function calcularMeses(admissao, demissao) {
  const ini = new Date(admissao);
  const fim = new Date(demissao);

  if (fim <= ini) return null;

  const diffDias =
    Math.floor((fim - ini) / (1000 * 60 * 60 * 24)) + 1;

  const mesesTrabalhados = Math.floor(diffDias / 30);
  const diasRestantes = diffDias % 30;

  let mesesFGTS = mesesTrabalhados;
  if (diasRestantes >= 15) mesesFGTS++;

  return {
    mesesTrabalhados,
    mesesFGTS,
    diasRestantes
  };
}

// ================= FUNÇÃO PRINCIPAL =================
function calcularRescisao() {

  // ===== DADOS =====
  const salario = Number(document.getElementById('salario').value) || 0;
  const admissao = document.getElementById('admissao').value;
  const demissao = document.getElementById('demissao').value;

  const tipoDemissao = document.getElementById('tipoDemissao').value;
  const avisoIndenizado =
    document.getElementById('avisoIndenizado').value === 'sim';
  const temFeriasVencidas =
    document.getElementById('temFeriasVencidas').value === 'sim';

  const periculosidadePerc =
    Number(document.getElementById('periculosidade').value) || 0;
  const insalubridadePerc =
    Number(document.getElementById('insalubridade').value) || 0;
  const horasExtras =
    Number(document.getElementById('horasExtras').value) || 0;

  if (!salario || !admissao || !demissao) {
    alert('Preencha todos os campos.');
    return;
  }

  // ===== MESES =====
  const mesesCalc = calcularMeses(admissao, demissao);
  if (!mesesCalc) {
    alert('Datas inválidas.');
    return;
  }

  const { mesesTrabalhados, mesesFGTS, diasRestantes } = mesesCalc;

  // ===== ADICIONAIS =====
  const periculosidade = salario * (periculosidadePerc / 100);
  const insalubridade = salario * (insalubridadePerc / 100);
  const adicionais = periculosidade + insalubridade + horasExtras;

  const salarioBase = salario + adicionais;

  // ===== SALDO DE SALÁRIO (COM ADICIONAIS CORRETOS) =====
const diaDemissao = new Date(demissao).getDate();

// CLT: salário mensal dividido por 30
const saldoSalario = (salarioBase / 30) * diaDemissao;

  // ===== AVISO PRÉVIO =====
  let avisoPrevio = 0;
  if (tipoDemissao === 'semJusta' && avisoIndenizado) {
    avisoPrevio = salarioBase;
  }

  // ===== FÉRIAS =====
  const mesesProporcionais = mesesTrabalhados % 12;

  let feriasVencidas = 0;
  if (temFeriasVencidas) {
    // férias vencidas em DOBRO + 1/3
    feriasVencidas = salarioBase * 2 * 1.3333;
  }

  const feriasProporcionais =
    (salarioBase / 12) * mesesProporcionais;
  const feriasProporcionaisComTerco =
    feriasProporcionais * 1.3333;

  const feriasTotal =
    feriasVencidas + feriasProporcionaisComTerco;

  // ===== 13º (PERÍODO CORRETO) =====
  let meses13 =
    (new Date(demissao).getMonth() + 1);

  if (new Date(demissao).getDate() < 15) meses13--;

  if (meses13 < 0) meses13 = 0;
  if (meses13 > 12) meses13 = 12;

  const decimoTerceiro =
    (salarioBase / 12) * meses13;

  // ===== FGTS =====
  const fgtsSalario =
    salarioBase * 0.08 * mesesFGTS;

  const fgts13 =
    decimoTerceiro * 0.08;

  const fgtsFerias =
    feriasTotal * 0.08;

  const fgtsTotal =
    fgtsSalario + fgts13 + fgtsFerias;

  // ===== MULTA FGTS =====
  const multaFGTS =
    tipoDemissao === 'semJusta'
      ? fgtsTotal * 0.4
      : 0;

  // ===== INSS =====
  const baseINSS =
    saldoSalario +
    avisoPrevio +
    decimoTerceiro +
    feriasTotal;

  let inss = 0;
  if (baseINSS <= 1320) inss = baseINSS * 0.075;
  else if (baseINSS <= 2571.29) inss = baseINSS * 0.09;
  else if (baseINSS <= 3856.94) inss = baseINSS * 0.12;
  else if (baseINSS <= 7507.49) inss = baseINSS * 0.14;
  else inss = 7507.49 * 0.14;

  // ===== IR =====
  const baseIR = baseINSS - inss;
  let ir = 0;

  if (baseIR > 1903.98 && baseIR <= 2826.65)
    ir = baseIR * 0.075 - 142.8;
  else if (baseIR <= 3751.05)
    ir = baseIR * 0.15 - 354.8;
  else if (baseIR <= 4664.68)
    ir = baseIR * 0.225 - 636.13;
  else if (baseIR > 4664.68)
    ir = baseIR * 0.275 - 869.36;

  if (ir < 0) ir = 0;

  // ===== TOTAL =====
  const totalLiquido =
    saldoSalario +
    avisoPrevio +
    feriasTotal +
    decimoTerceiro +
    multaFGTS -
    inss -
    ir;

  // ===== RESULTADO =====
  document.getElementById('resultadoRescisao').style.display = 'block';

  document.getElementById('resMeses').innerText = mesesTrabalhados;
  document.getElementById('resMesesFGTS').innerText = mesesFGTS;

  document.getElementById('resSaldo').innerText = formatBRL(saldoSalario);
  document.getElementById('resAviso').innerText = formatBRL(avisoPrevio);
  document.getElementById('resFerias').innerText = formatBRL(feriasTotal);
  document.getElementById('res13').innerText = formatBRL(decimoTerceiro);
  document.getElementById('resFGTS').innerText = formatBRL(fgtsTotal);
  document.getElementById('resMulta').innerText = formatBRL(multaFGTS);
  document.getElementById('resINSS').innerText = formatBRL(inss);
  document.getElementById('resIR').innerText = formatBRL(ir);
  document.getElementById('resTotal').innerText = formatBRL(totalLiquido);
}
</script>