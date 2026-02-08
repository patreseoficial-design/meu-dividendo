// -------------------- FUNÇÃO AUXILIAR FORMATAÇÃO --------------------
function formatBRL(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// -------------------- MENU HAMBÚRGUER --------------------
function toggleMenu() {
  const menu = document.getElementById('menuLinks');
  if (!menu) return;
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// -------------------- FUNÇÃO COMPLETA PARA CALCULAR RESCISÃO --------------------
function calcularRescisao() {
  // ================= DADOS BÁSICOS =================
  const salario = Number(document.getElementById('salario')?.value) || 0;
  const admissaoInput = document.getElementById('admissao')?.value;
  const demissaoInput = document.getElementById('demissao')?.value;
  const admissao = new Date(admissaoInput);
  const demissao = new Date(demissaoInput);

  const tipoDemissao = document.getElementById('tipoDemissao')?.value;
  const avisoIndenizado = document.getElementById('avisoIndenizado')?.value === 'sim';
  const temFeriasVencidas = document.getElementById('feriasVencidas')?.value === 'sim';

  const periculosidadePerc = Number(document.getElementById('periculosidade')?.value) || 0;
  const insalubridadePerc = Number(document.getElementById('insalubridade')?.value) || 0;
  const horasExtras = Number(document.getElementById('horasExtras')?.value) || 0;

  // ================= VALIDAÇÕES =================
  if (!salario || isNaN(admissao) || isNaN(demissao) || demissao <= admissao) {
    alert('Preencha todos os campos corretamente.');
    return;
  }

  // ================= ADICIONAIS =================
  const periculosidade = salario * (periculosidadePerc / 100);
  const insalubridade = salario * (insalubridadePerc / 100);
  const adicionais = periculosidade + insalubridade + horasExtras;
  const salarioBase = salario + adicionais;

  // ============================
// CÁLCULO DE MESES TRABALHADOS E MESES FGTS
// ============================

function calcularMeses(admissao, demissao) {

  // Converte datas para objeto Date
  const dataAdmissao = new Date(admissao);
  const dataDemissao = new Date(demissao);

  // Diferença total em milissegundos
  const diffTime = dataDemissao.getTime() - dataAdmissao.getTime();

  // Converte para dias (1 dia = 1000 * 60 * 60 * 24)
  const diasTrabalhados = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

  // ============================
  // MESES TRABALHADOS
  // ============================
  // Regra CLT: 30 dias = 1 mês
  const mesesTrabalhados = Math.floor(diasTrabalhados / 30);

  // Dias restantes que não fecharam um mês
  const diasRestantes = diasTrabalhados % 30;

  // ============================
  // MESES PARA FGTS
  // ============================
  // Se tiver 15 dias ou mais, conta +1 mês
  let mesesFGTS = mesesTrabalhados;

  if (diasRestantes >= 15) {
    mesesFGTS += 1;
  }

  // ============================
  // RETORNO DOS VALORES
  // ============================
  return {
    diasTrabalhados,
    mesesTrabalhados,
    mesesFGTS
  };
}
  // ================= SALDO SALÁRIO =================
  const saldoSalario = (salarioBase / 30) * diasRestantes;

  // ================= AVISO PRÉVIO =================
  let avisoPrevio = 0;
  if (tipoDemissao === 'semJusta' && avisoIndenizado) {
    avisoPrevio = salarioBase; // 1 salário indenizado
  }

  // ================= FÉRIAS =================
  const mesesProporcionais = mesesTrabalhados % 12;
  let feriasVencidas = 0;
  if (temFeriasVencidas) {
    feriasVencidas = salarioBase * 1.3333; // salário + 1/3
  }
  const feriasProporcionais = (salarioBase / 12) * mesesProporcionais;
  const feriasProporcionaisComTerco = feriasProporcionais * 1.3333;
  const feriasComUmTerco = feriasVencidas + feriasProporcionaisComTerco;

  // ================= 13º =================
  let meses13 = (demissao.getFullYear() - admissao.getFullYear()) * 12 +
                (demissao.getMonth() - admissao.getMonth());
  if (demissao.getDate() >= 15) meses13 += 1;
  if (meses13 > 12) meses13 = 12;
  if (meses13 < 0) meses13 = 0;
  const decimoTerceiro = (salarioBase / 12) * meses13;

  // ================= FGTS =================
  // FGTS sobre salário + adicionais
  const fgtsSalario = salarioBase * 0.08 * mesesFGTS;

  // FGTS sobre férias
  const fgtsFerias = feriasComUmTerco * 0.08;

  // FGTS sobre 13º
  const fgts13 = decimoTerceiro * 0.08;

  const fgts = fgtsSalario + fgtsFerias + fgts13;

  // ================= INSS =================
  const baseINSS = saldoSalario + avisoPrevio + decimoTerceiro + feriasComUmTerco;
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

  // ================= TOTAL LÍQUIDO =================
  const totalLiquido = saldoSalario + avisoPrevio + feriasComUmTerco + decimoTerceiro +
                       fgts - inss - ir;

  // ================= EXIBIR RESULTADOS =================
  const resDiv = document.getElementById('resultadoRescisao');
  if (!resDiv) return;
  resDiv.style.display = 'block';

  document.getElementById('resSaldo').innerText = formatBRL(saldoSalario);
  document.getElementById('resAviso').innerText = formatBRL(avisoPrevio);
  document.getElementById('resMeses').innerText = mesesTrabalhados;
  document.getElementById('resMesesFGTS').innerText = mesesFGTS;

  const elFeriasVencidas = document.getElementById('resFeriasVencidas');
  if (temFeriasVencidas) {
    elFeriasVencidas.style.display = 'block';
    elFeriasVencidas.innerText = formatBRL(feriasVencidas);
  } else {
    elFeriasVencidas.style.display = 'none';
  }

  document.getElementById('resFerias').innerText = formatBRL(feriasProporcionaisComTerco);
  document.getElementById('res13').innerText = formatBRL(decimoTerceiro);
  document.getElementById('resFGTS').innerText = formatBRL(fgts);
  document.getElementById('resINSS').innerText = formatBRL(inss);
  document.getElementById('resIR').innerText = formatBRL(ir);
  document.getElementById('resTotal').innerText = formatBRL(totalLiquido);
}
function calcularRescisao() {

  const admissao = document.getElementById('dataAdmissao').value;
  const demissao = document.getElementById('dataDemissao').value;

  if (!admissao || !demissao) {
    alert('Preencha as datas corretamente');
    return;
  }

  const resultado = calcularMeses(admissao, demissao);

  // Mostra no HTML
  document.getElementById('resMesesTrabalhados').innerText =
    resultado.mesesTrabalhados;

  document.getElementById('resMesesFGTS').innerText =
    resultado.mesesFGTS;
}