// -------------------- FUNÇÃO AUXILIAR FORMATAÇÃO --------------------
function formatBRL(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// -------------------- MENU HAMBÚRGUER --------------------
function toggleMenu() {
  const menu = document.getElementById('menuLinks');
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// -------------------- CALCULADORA DE RESCISÃO --------------------
function calcularRescisao() {
  const salario = Number(document.getElementById('salario').value) || 0;
  const admissao = document.getElementById('admissao').value;
  const demissao = document.getElementById('demissao').value;
  const tipoDemissao = document.getElementById('tipoDemissao').value;
  const avisoIndenizado = document.getElementById('avisoIndenizado').checked;

  const periculosidadePerc = Number(document.getElementById('periculosidade')?.value) || 0;
  const insalubridadePerc = Number(document.getElementById('insalubridade')?.value) || 0;
  const horasExtras = Number(document.getElementById('horasExtras')?.value) || 0;

  if (!salario || !admissao || !demissao) {
    alert('Informe salário, datas de admissão e demissão.');
    return;
  }

  // --- DATAS ---
  const dtAdmissao = new Date(admissao);
  const dtDemissao = new Date(demissao);

  let anos = dtDemissao.getFullYear() - dtAdmissao.getFullYear();
  let meses = dtDemissao.getMonth() - dtAdmissao.getMonth();
  let dias = dtDemissao.getDate() - dtAdmissao.getDate();

  if (dias < 0) {
    meses -= 1;
    dias += 30;
  }
  if (meses < 0) {
    anos -= 1;
    meses += 12;
  }

  const mesesTrabalhados = anos * 12 + meses + (dias > 0 ? 1 : 0);
  const diasTrabalhadosMesDemissao = dias > 0 ? dias : 0;

  // --- ADICIONAIS ---
  const periculosidade = salario * (periculosidadePerc / 100);
  const insalubridade = salario * (insalubridadePerc / 100);
  const adicionais = periculosidade + insalubridade + horasExtras;

  // --- SALDO DE SALÁRIO ---
  const saldoSalario = ((salario + adicionais) / 30) * diasTrabalhadosMesDemissao;

  // --- AVISO PRÉVIO ---
  let avisoPrevio = 0;
  if (tipoDemissao === 'semJusta' && avisoIndenizado) avisoPrevio = salario + adicionais;

  // --- FÉRIAS ---
  const feriasProporcionais = ((salario + adicionais) / 12) * mesesTrabalhados;
  const feriasComUmTerco = feriasProporcionais * 1.3333;

  // --- 13º ---
  const decimoTerceiro = ((salario + adicionais) / 12) * mesesTrabalhados;

  // --- FGTS ---
  const fgtsBase = saldoSalario + avisoPrevio + feriasProporcionais + decimoTerceiro + adicionais;
  const fgts = fgtsBase * 0.08;
  const multaFGTS = tipoDemissao === 'semJusta' ? fgts * 0.4 : 0;

  // --- INSS ---
  const baseINSS = saldoSalario + avisoPrevio + feriasComUmTerco + decimoTerceiro + adicionais;
  let inss = 0;
  if (baseINSS <= 1320) inss = baseINSS * 0.075;
  else if (baseINSS <= 2571.29) inss = baseINSS * 0.09;
  else if (baseINSS <= 3856.94) inss = baseINSS * 0.12;
  else if (baseINSS <= 7507.49) inss = baseINSS * 0.14;
  else inss = 7507.49 * 0.14;

  // --- IRRF ---
  const baseIR = baseINSS - inss;
  let ir = 0;
  if (baseIR > 1903.98 && baseIR <= 2826.65) ir = baseIR * 0.075 - 142.8;
  else if (baseIR <= 3751.05) ir = baseIR * 0.15 - 354.8;
  else if (baseIR <= 4664.68) ir = baseIR * 0.225 - 636.13;
  else if (baseIR > 4664.68) ir = baseIR * 0.275 - 869.36;
  if (ir < 0) ir = 0;

  // --- TOTAL LÍQUIDO ---
  const totalLiquido = saldoSalario + avisoPrevio + feriasComUmTerco + decimoTerceiro + adicionais + multaFGTS - inss - ir;

  // --- EXIBIR ---
  const resBox = document.getElementById('resultadoRescisao');
  resBox.style.display = 'block';

  document.getElementById('resSaldo').innerText = `Saldo de Salário: ${formatBRL(saldoSalario)}`;
  document.getElementById('resAviso').innerText = `Aviso Prévio (${avisoIndenizado ? 'indenizado' : 'não indenizado'}): ${formatBRL(avisoPrevio)}`;
  document.getElementById('resFerias').innerText = `Férias + 1/3: ${formatBRL(feriasComUmTerco)}`;
  document.getElementById('res13').innerText = `13º Proporcional: ${formatBRL(decimoTerceiro)}`;
  document.getElementById('resAdicionais').innerText = `Adicionais: ${formatBRL(adicionais)}`;
  document.getElementById('resFGTS').innerText = `FGTS (8%): ${formatBRL(fgts)}`;
  document.getElementById('resMulta').innerText = `Multa FGTS (40%): ${formatBRL(multaFGTS)}`;
  document.getElementById('resINSS').innerText = `Desconto INSS: ${formatBRL(inss)}`;
  document.getElementById('resIR').innerText = `Desconto IRRF: ${formatBRL(ir)}`;
  document.getElementById('resTotal').innerText = `Total Líquido da Rescisão: ${formatBRL(totalLiquido)}`;

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