// -------------------- MENU HAMBÚRGUER --------------------
function toggleMenu() {
  const menu = document.getElementById('menuLinks');
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// -------------------- CALCULADORA DE RESCISÃO --------------------
function calcularRescisao() {
  // --- PEGANDO DADOS ---
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

  // --- DATAS E TEMPO TRABALHADO ---
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

  // --- ADICIONAIS PROPORCIONAIS ---
  const periculosidade = (salario * periculosidadePerc / 100);
  const insalubridade = (salario * insalubridadePerc / 100);

  const adicionaisProporcionais = periculosidade + insalubridade + horasExtras;

  // --- SALDO DE SALÁRIO ---
  const saldoSalario = ((salario + adicionaisProporcionais) / 30) * diasTrabalhadosMesDemissao;

  // --- AVISO PRÉVIO ---
  let avisoPrevio = 0;
  if (tipoDemissao === 'semJusta' && avisoIndenizado) {
    avisoPrevio = salario + adicionaisProporcionais;
  }

  // --- FÉRIAS PROPORCIONAIS ---
  const feriasProporcionais = ((salario + adicionaisProporcionais) / 12) * mesesTrabalhados;
  const feriasComUmTerco = feriasProporcionais * (1 + 1/3);

  // --- 13º SALÁRIO PROPORCIONAL ---
  const decimoTerceiro = ((salario + adicionaisProporcionais) / 12) * mesesTrabalhados;

  // --- FGTS ---
  const fgtsBase = saldoSalario + avisoPrevio + feriasProporcionais + decimoTerceiro + adicionaisProporcionais;
  const fgts = fgtsBase * 0.08;
  const multaFGTS = tipoDemissao === 'semJusta' ? fgts * 0.4 : 0;

  // --- INSS ---
  const baseINSS = saldoSalario + avisoPrevio + feriasComUmTerco + decimoTerceiro + adicionaisProporcionais;
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
  const totalLiquido = saldoSalario + avisoPrevio + feriasComUmTerco + decimoTerceiro + adicionaisProporcionais + multaFGTS - inss - ir;

  // --- EXIBIR RESULTADOS ---
  const resBox = document.getElementById('resultadoRescisao');
  resBox.style.display = 'block';

  document.getElementById('resSaldo').innerText = `Saldo de Salário: R$ ${saldoSalario.toFixed(2)}`;
  document.getElementById('resAviso').innerText = `Aviso Prévio (${avisoIndenizado ? 'indenizado' : 'não indenizado'}): R$ ${avisoPrevio.toFixed(2)}`;
  document.getElementById('resFerias').innerText = `Férias + 1/3: R$ ${feriasComUmTerco.toFixed(2)}`;
  document.getElementById('res13').innerText = `13º Proporcional: R$ ${decimoTerceiro.toFixed(2)}`;
  document.getElementById('resAdicionais').innerText = `Adicionais: R$ ${adicionaisProporcionais.toFixed(2)}`;
  document.getElementById('resFGTS').innerText = `FGTS (8%): R$ ${fgts.toFixed(2)}`;
  document.getElementById('resMulta').innerText = `Multa FGTS (40%): R$ ${multaFGTS.toFixed(2)}`;
  document.getElementById('resINSS').innerText = `Desconto INSS: R$ ${inss.toFixed(2)}`;
  document.getElementById('resIR').innerText = `Desconto IRRF: R$ ${ir.toFixed(2)}`;
  document.getElementById('resTotal').innerText = `Total Líquido da Rescisão: R$ ${totalLiquido.toFixed(2)}`;

  // --- GRÁFICO ---
  const ctx = document.getElementById('graficoRescisao').getContext('2d');
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
          adicionaisProporcionais,
          fgts,
          multaFGTS,
          inss,
          ir
        ],
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