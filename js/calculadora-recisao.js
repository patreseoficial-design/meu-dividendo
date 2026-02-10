<script>
// ================= FORMATADOR =================
function formatBRL(v) {
  return v.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

// ================= MESES CLT =================
function calcularMesesCLT(admissao, demissao) {
  const ini = new Date(admissao);
  const fim = new Date(demissao);
  if (fim <= ini) return null;

  let mesesContrato = 0;
  let mesesFGTS = 0;
  let mesesPara13 = 0;
  const anoDemissao = fim.getFullYear();

  let cursor = new Date(ini.getFullYear(), ini.getMonth(), 1);

  while (cursor <= fim) {
    const primeiro = new Date(cursor);
    const ultimo = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);

    const inicioMes = ini > primeiro ? ini : primeiro;
    const fimMes = fim < ultimo ? fim : ultimo;

    if (fimMes >= inicioMes) {
      const dias = Math.floor((fimMes - inicioMes) / (1000 * 60 * 60 * 24)) + 1;
      mesesContrato++;
      if (dias >= 15) mesesFGTS++;
      if (cursor.getFullYear() === anoDemissao && dias >= 15) mesesPara13++;
    }

    cursor.setMonth(cursor.getMonth() + 1);
  }

  return { mesesContrato, mesesFGTS, mesesPara13 };
}

// ================= FUNÇÃO PRINCIPAL =================
function calcularRescisao() {
  // ===== DADOS DO USUÁRIO =====
  const salario = Number(document.getElementById('salario').value) || 0;
  const admissao = document.getElementById('admissao').value;
  const demissao = document.getElementById('demissao').value;
  const tipoDemissao = document.getElementById('tipoDemissao').value;
  const avisoIndenizado = document.getElementById('avisoIndenizado').value === 'sim';
  const qtdFeriasVencidas = Number(document.getElementById('qtdFeriasVencidas').value || 0);
  const periculosidadePerc = Number(document.getElementById('periculosidade').value) || 0;
  const insalubridadePerc = Number(document.getElementById('insalubridade').value) || 0;
  const horasExtras = Number(document.getElementById('horasExtras').value) || 0;

  if (!salario || !admissao || !demissao) {
    alert('Preencha todos os campos');
    return;
  }

  // ===== ADICIONAIS =====
  const periculosidade = salario * (periculosidadePerc / 100);
  const insalubridade = salario * (insalubridadePerc / 100);
  const salarioBase = salario + periculosidade + insalubridade + horasExtras;

  // ===== MESES =====
const meses = calcularMesesCLT(admissao, demissao);
if (!meses) return;
const { mesesContrato, mesesFGTS } = meses;
function calcularMeses13(admissao, demissao) {
  const ini = new Date(admissao);
  const fim = new Date(demissao);

// ================= FUNÇÃO AUXILIAR =================
// Calcula os meses do 13º salário apenas no ano da demissão
function calcularMeses13(admissao, demissao) {
  const ini = new Date(admissao);
  const fim = new Date(demissao);

  const anoDemissao = fim.getFullYear();

  // início do ano da demissão
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

  return meses13 > 12 ? 12 : meses13;
}

// ================= CÁLCULO DO 13º =================
const mesesPara13 = calcularMeses13(admissao, demissao);

// Atualiza o span no HTML
document.getElementById('resMeses13').innerText = mesesPara13;

// Calcula 13º proporcional usando os meses corretos
const decimoTerceiro = (salarioBase / 12) * mesesPara13;

// Atualiza o valor do 13º no HTML
document.getElementById('res13').innerText = formatBRL(decimoTerceiro);


// Atualiza spans dinâmicos
document.getElementById('resMeses').innerText = mesesContrato;
document.getElementById('resMesesFGTS').innerText = mesesFGTS;
document.getElementById('resMeses13').innerText = mesesPara13;

  // ===== 13º PROPORCIONAL =====
  const decimoTerceiro = (salarioBase / 12) * mesesPara13;

  // ===== SALDO DE SALÁRIO =====
  const diaDemissao = new Date(demissao).getDate();
  const saldoSalario = (salarioBase / 30) * diaDemissao;

  // ===== AVISO PRÉVIO =====
  const avisoPrevio = tipoDemissao === 'semJusta' && avisoIndenizado ? salarioBase : 0;

  // ===== FÉRIAS =====
  let feriasVencidas = 0;
  let tercoVencidas = 0;

  if (qtdFeriasVencidas === 1) {
    feriasVencidas = salarioBase;
    tercoVencidas = salarioBase / 3;
  } else if (qtdFeriasVencidas >= 2) {
    feriasVencidas = salarioBase * 2;
    tercoVencidas = salarioBase / 3;
  }

  const mesesProporcionais = mesesContrato % 12;
  const feriasProporcionais = (salarioBase / 12) * mesesProporcionais;
  const tercoProporcionais = feriasProporcionais / 3;

  const feriasTotal = feriasVencidas + tercoVencidas + feriasProporcionais + tercoProporcionais;

  // ===== FGTS =====
  const fgtsSalario = salarioBase * 0.08 * mesesFGTS;
  const fgts13 = decimoTerceiro * 0.08;
  const fgtsFerias = feriasTotal * 0.08;
  const fgtsTotal = fgtsSalario + fgts13 + fgtsFerias;
  const multaFGTS = tipoDemissao === 'semJusta' ? fgtsTotal * 0.4 : 0;

  // ===== INSS =====
  const baseINSS = saldoSalario + avisoPrevio + decimoTerceiro + tercoVencidas + tercoProporcionais;
  let inss = 0;
  if (baseINSS <= 1320) inss = baseINSS * 0.075;
  else if (baseINSS <= 2571.29) inss = 1320 * 0.075 + (baseINSS - 1320) * 0.09;
  else if (baseINSS <= 3856.94) inss = 1320 * 0.075 + (2571.29 - 1320) * 0.09 + (baseINSS - 2571.29) * 0.12;
  else inss = 1320 * 0.075 + (2571.29 - 1320) * 0.09 + (3856.94 - 2571.29) * 0.12 + (baseINSS - 3856.94) * 0.14;

  // ===== IR =====
  const baseIR = saldoSalario + avisoPrevio + decimoTerceiro - inss;
  let ir = 0;
  if (baseIR > 1903.98 && baseIR <= 2826.65) ir = baseIR * 0.075 - 142.8;
  else if (baseIR <= 3751.05) ir = baseIR * 0.15 - 354.8;
  else if (baseIR <= 4664.68) ir = baseIR * 0.225 - 636.13;
  else if (baseIR > 4664.68) ir = baseIR * 0.275 - 869.36;
  if (ir < 0) ir = 0;

  // ===== TOTAL =====
  const totalLiquido = saldoSalario + avisoPrevio + feriasTotal + decimoTerceiro + multaFGTS - inss - ir;

  // ===== RESULTADO =====
  document.getElementById('resultadoRescisao').style.display = 'block';
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