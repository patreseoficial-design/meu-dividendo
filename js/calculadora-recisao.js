// -------------------- FUNÇÃO AUXILIAR FORMATAÇÃO --------------------
function formatBRL(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// -------------------- MENU HAMBÚRGUER --------------------
function toggleMenu() {
  const menu = document.getElementById('menuLinks');
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// -------------------- CALCULADORA DE RESCISAO
  
function formatBRL(valor) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

function calcularRescisao() {
  const salario = Number(document.getElementById('salario').value) || 0;
  const admissao = new Date(document.getElementById('admissao').value);
  const demissao = new Date(document.getElementById('demissao').value);
  const tipoDemissao = document.getElementById('tipoDemissao').value;
  const avisoIndenizado = document.getElementById('avisoIndenizado').checked;

  const periculosidadePerc = Number(document.getElementById('periculosidade').value) || 0;
  const insalubridadePerc = Number(document.getElementById('insalubridade').value) || 0;
  const horasExtras = Number(document.getElementById('horasExtras').value) || 0;

  if (!salario || !admissao || !demissao) {
    alert('Preencha todos os campos.');
    return;
  }

  /* ================= ADICIONAIS ================= */
  const periculosidade = salario * (periculosidadePerc / 100);
  const insalubridade = salario * (insalubridadePerc / 100);
  const adicionais = periculosidade + insalubridade + horasExtras;

  const salarioBase = salario + adicionais;

  /* ================= SALDO DE SALÁRIO ================= */
  const diasTrabalhados = demissao.getDate();
  const saldoSalario = (salarioBase / 30) * diasTrabalhados;

  /* ================= AVISO PRÉVIO ================= */
  let avisoPrevio = 0;
  if (tipoDemissao === 'semJusta' && avisoIndenizado) {
    avisoPrevio = salarioBase;
  }

  /* ================= FÉRIAS PROPORCIONAIS ================= */
  const mesesAnoAtual = demissao.getMonth() + 1;
  const feriasProporcionais = (salarioBase / 12) * mesesAnoAtual;
  const feriasComUmTerco = feriasProporcionais * 1.3333;

  /* ================= 13º PROPORCIONAL ================= */
  const decimoTerceiro = (salarioBase / 12) * mesesAnoAtual;

  /* ================= FGTS ================= */
  const fgtsBase = saldoSalario + avisoPrevio + decimoTerceiro;
  const fgts = fgtsBase * 0.08;
  const multaFGTS = tipoDemissao === 'semJusta' ? fgts * 0.4 : 0;

  /* ================= INSS ================= */
  const baseINSS = saldoSalario + avisoPrevio + decimoTerceiro;
  let inss = 0;

  if (baseINSS <= 1320) inss = baseINSS * 0.075;
  else if (baseINSS <= 2571.29) inss = baseINSS * 0.09;
  else if (baseINSS <= 3856.94) inss = baseINSS * 0.12;
  else if (baseINSS <= 7507.49) inss = baseINSS * 0.14;
  else inss = 7507.49 * 0.14;

  /* ================= IRRF ================= */
  const baseIR = baseINSS - inss;
  let ir = 0;

  if (baseIR > 1903.98 && baseIR <= 2826.65) ir = baseIR * 0.075 - 142.8;
  else if (baseIR <= 3751.05) ir = baseIR * 0.15 - 354.8;
  else if (baseIR <= 4664.68) ir = baseIR * 0.225 - 636.13;
  else if (baseIR > 4664.68) ir = baseIR * 0.275 - 869.36;

  if (ir < 0) ir = 0;

  /* ================= TOTAL LÍQUIDO ================= */
  const totalLiquido =
    saldoSalario +
    avisoPrevio +
    feriasComUmTerco +
    decimoTerceiro +
    multaFGTS -
    inss -
    ir;

  /* ================= EXIBIR ================= */
  document.getElementById('resultadoRescisao').style.display = 'block';

  document.getElementById('resSaldo').innerText = `Saldo de salário: ${formatBRL(saldoSalario)}`;
  document.getElementById('resAviso').innerText = `Aviso prévio: ${formatBRL(avisoPrevio)}`;
  document.getElementById('resFerias').innerText = `Férias + 1/3: ${formatBRL(feriasComUmTerco)}`;
  document.getElementById('res13').innerText = `13º proporcional: ${formatBRL(decimoTerceiro)}`;
  document.getElementById('resFGTS').innerText = `FGTS: ${formatBRL(fgts)}`;
  document.getElementById('resMulta').innerText = `Multa FGTS (40%): ${formatBRL(multaFGTS)}`;
  document.getElementById('resINSS').innerText = `Desconto INSS: ${formatBRL(inss)}`;
  document.getElementById('resIR').innerText = `Desconto IRRF: ${formatBRL(ir)}`;
  document.getElementById('resTotal').innerText = `Total líquido da rescisão: ${formatBRL(totalLiquido)}`;
}



  // --- GRÁFICO ---
  const ctx = document.getElementById('graficoRescisao').getContext('2d');
  if (window.graficoRescisao) window.graficoRescisao.destroy();
  window.graficoRescisao = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Saldo', 'Aviso', 'Férias', '13º', 'Adicionais', 'FGTS', 'Multa FGTS', 'INSS', 'IR'],
      datasets: [{
        label: 'Valores (R$)',
        data: [saldoSalario, avisoPrevio, feriasComUmTerco, decimoTerceiro, adicionais, fgts, multaFGTS, inss, ir],
        backgroundColor: [
          '#4caf50', '#2196f3', '#ff9800', '#9c27b0', '#00bcd4', '#f44336', '#607d8b', '#795548', '#9e9e9e'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });
}