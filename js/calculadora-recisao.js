// ================= JS COMPLETO - Calculadora Rescisão 2026 ✅ =================

// ================= MENU HAMBÚRGUER =================
function toggleMenu() {
  const menu = document.getElementById('menuLinks');
  if (!menu) return;
  menu.classList.toggle('show');
}

// ================= FORMATADOR =================
function formatBRL(v) {
  return v.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

// ================= TABELAS FISCAIS 2026 =================
const TABELA_INSS = [
  { ate: 1412.00, aliquota: 0.075 },
  { ate: 2666.68, aliquota: 0.09 },
  { ate: 4000.03, aliquota: 0.12 },
  { ate: 7786.02, aliquota: 0.14 },
  { ate: Infinity, aliquota: 0.14, teto: 908.86 }
];

const TABELA_IRRF = [
  { ate: 2259.20, aliquota: 0, deducao: 0 },
  { ate: 2826.65, aliquota: 0.075, deducao: 169.54 },
  { ate: 3751.05, aliquota: 0.15, deducao: 381.44 },
  { ate: 4664.68, aliquota: 0.225, deducao: 662.66 },
  { ate: Infinity, aliquota: 0.275, deducao: 896.00 }
];

// ================= CÁLCULO INSS PROGRESSIVO ✅ =================
function calcularINSSProgressivo(base) {
  let inss = 0;
  let anterior = 0;
  for (let i = 0; i < TABELA_INSS.length - 1; i++) {
    const faixa = TABELA_INSS[i];
    const proxima = TABELA_INSS[i + 1].ate;
    const limite = Math.min(base, proxima);
    if (limite > anterior) {
      inss += (limite - anterior) * faixa.aliquota;
    }
    anterior = proxima;
    if (base <= faixa.ate) break;
  }
  return Math.min(inss, TABELA_INSS[4].teto);
}

// ================= CÁLCULO IRRF ✅ =================
function calcularIRRF(baseIR, dependentes = 0) {
  const deducaoDependentes = dependentes * 189.59;
  const baseCalculada = Math.max(0, baseIR - deducaoDependentes);
  let ir = 0;
  for (let faixa of TABELA_IRRF) {
    if (baseCalculada <= faixa.ate) {
      ir = (baseCalculada * faixa.aliquota) - faixa.deducao;
      break;
    }
  }
  return Math.max(0, ir);
}

// ================= MESES CLT - REGRA 15 DIAS ✅ =================
function calcularMesesCLT(admissao, demissao) {
  const ini = new Date(admissao);
  const fim = new Date(demissao);
  if (fim <= ini) return null;

  let mesesContrato = 0;
  let mesesFGTS = 0;
  let cursor = new Date(ini.getFullYear(), ini.getMonth(), 1);
  
  while (cursor <= fim) {
    const primeiro = new Date(cursor);
    const ultimo = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
    const inicioMes = ini > primeiro ? ini : primeiro;
    const fimMes = fim < ultimo ? fim : ultimo;

    const dias = Math.floor((fimMes - inicioMes) / (1000 * 60 * 60 * 24)) + 1;
    mesesContrato++;
    if (dias >= 15) mesesFGTS++;
    
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return { mesesContrato, mesesFGTS };
}

// ================= 13º SÓ ANO DA DEMISSÃO ✅ =================
function calcularMeses13(admissao, demissao) {
  const ini = new Date(admissao);
  const fim = new Date(demissao);
  const anoDemissao = fim.getFullYear();
  const inicioAno = new Date(anoDemissao, 0, 1);
  const inicio = ini > inicioAno ? ini : inicioAno;

  let meses13 = 0;
  let cursor = new Date(inicio.getFullYear(), inicio.getMonth(), 1);

  while (cursor <= fim) {
    const primeiroDia = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const ultimoDia = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
    const inicioMes = inicio > primeiroDia ? inicio : primeiroDia;
    const fimMes = fim < ultimoDia ? fim : ultimoDia;

    const dias = Math.floor((fimMes - inicioMes) / (1000 * 60 * 60 * 24)) + 1;
    if (dias >= 15) meses13++;
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return Math.min(meses13, 12);
}

// ================= CALCULADORA RESCISÃO ✅ 100% FUNCIONAL =================
function calcularRescisao() {
  // ✅ INPUTS SIMPLIFICADOS (sem replace complexo)
  const salario = Number(document.getElementById('salario').value) || 0;
  const admissao = document.getElementById('admissao').value;
  const demissao = document.getElementById('demissao').value;
  const tipoDemissao = document.getElementById('tipoDemissao').value;
  const avisoIndenizado = document.getElementById('avisoIndenizado').value === 'sim';
  const qtdFeriasVencidas = Number(document.getElementById('qtdFeriasVencidas').value) || 0;
  const periculosidadePerc = Number(document.getElementById('periculosidade').value) || 0;
  const insalubridadePerc = Number(document.getElementById('insalubridade').value) || 0;
  const horasExtras = Number(document.getElementById('horasExtras').value) || 0;
  const dependentes = Number(document.getElementById('dependentes')?.value) || 0;

  // Validações
  if (!salario || !admissao || !demissao) {
    alert('❌ Preencha salário, admissão e demissão.');
    return;
  }

  const mesesCLT = calcularMesesCLT(admissao, demissao);
  if (!mesesCLT) {
    alert('❌ Data de admissão deve ser anterior à demissão.');
    return;
  }

  const mesesPara13 = calcularMeses13(admissao, demissao);
  const { mesesContrato, mesesFGTS } = mesesCLT;

  // Salário base + adicionais
  const salarioBase = salario + salario * (periculosidadePerc / 100 + insalubridadePerc / 100) + horasExtras;

  // Verbas rescisórias
  const diaDemissao = new Date(demissao).getDate();
  const saldoSalario = (salarioBase / 30) * diaDemissao;
  
  // ✅ AVISO PRÉVIO CORRIGIDO (30 + 3 dias/ano)
  const anosTrabalhados = Math.floor(mesesContrato / 12);
  const diasAvisoTotal = Math.min(30 + 3 * anosTrabalhados, 90);
  const avisoPrevio = tipoDemissao === 'semJusta' && avisoIndenizado ? (salarioBase / 30) * diasAvisoTotal : 0;

  // Férias corrigidas
  let feriasVencidas = 0, tercoVencidas = 0;
  if (qtdFeriasVencidas === 1) {
    feriasVencidas = salario;
    tercoVencidas = salario / 3;
  } else if (qtdFeriasVencidas >= 2) {
    feriasVencidas = salario * 2;
    tercoVencidas = (salario * 2) / 3;
  }

  const mesesFeriasProp = mesesContrato % 12 || 12;
  const feriasProporcionais = (salario / 12) * mesesFeriasProp;
  const tercoProporcionais = feriasProporcionais / 3;
  const feriasTotal = feriasVencidas + tercoVencidas + feriasProporcionais + tercoProporcionais;

  // 13º proporcional (só ano da demissão)
  const decimoTerceiro = (salarioBase / 12) * mesesPara13;

  // FGTS completo
  const fgtsSalario = salario * 0.08 * mesesFGTS;
  const fgts13 = decimoTerceiro * 0.08;
  const fgtsFerias = (feriasProporcionais + feriasVencidas) * 0.08;
  const fgtsTotal = fgtsSalario + fgts13 + fgtsFerias;
  const multaFGTS = tipoDemissao === 'semJusta' ? fgtsTotal * 0.4 : 0;

  // Descontos fiscais (sem terço férias)
  const baseINSS = saldoSalario + avisoPrevio + decimoTerceiro;
  const inss = calcularINSSProgressivo(baseINSS);
  const baseIR = baseINSS - inss;
  const ir = calcularIRRF(baseIR, dependentes);

  // Total líquido
  const totalLiquido = saldoSalario + avisoPrevio + feriasTotal + decimoTerceiro + multaFGTS - inss - ir;

  // ✅ MOSTRAR TODOS RESULTADOS
  const resultado = document.getElementById('resultadoRescisao');
  const linhaFeriasVencidas = document.getElementById('linhaFeriasVencidas');

  linhaFeriasVencidas.style.display = qtdFeriasVencidas > 0 ? 'block' : 'none';
  resultado.style.display = 'block';

  document.getElementById('resMeses').innerText = `${mesesContrato} meses`;
  document.getElementById('resMesesFGTS').innerText = `${mesesFGTS} meses`;
  document.getElementById('resMeses13').innerText = `${mesesPara13} meses`;
  document.getElementById('resSaldo').innerText = formatBRL(saldoSalario);
  document.getElementById('resAviso').innerText = formatBRL(avisoPrevio);
  document.getElementById('resFerias').innerText = formatBRL(feriasTotal);
  document.getElementById('resFeriasVencidas').innerText = formatBRL(feriasVencidas + tercoVencidas);
  document.getElementById('res13').innerText = formatBRL(decimoTerceiro);
  document.getElementById('resFGTS').innerText = formatBRL(fgtsTotal);
  document.getElementById('resMulta').innerText = formatBRL(multaFGTS);
  document.getElementById('resINSS').innerText = `- ${formatBRL(inss)}`;
  document.getElementById('resIR').innerText = `- ${formatBRL(ir)}`;
  document.getElementById('resTotal').innerText = formatBRL(totalLiquido);
}