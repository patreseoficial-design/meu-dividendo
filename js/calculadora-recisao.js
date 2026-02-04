// -------------------- MENU HAMBÚRGUER --------------------
function toggleMenu() {
  const menu = document.getElementById('menuLinks');
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// -------------------- CALCULADORA DE RESCISÃO --------------------
function calcularRescisao() {
  // PEGANDO DADOS
  const salario = Number(document.getElementById('salario').value) || 0;
  const admissao = document.getElementById('admissao').value;
  const demissao = document.getElementById('demissao').value;
  const tipoDemissao = document.getElementById('tipoDemissao').value;

  if (!salario || !admissao || !demissao) {
    alert('Informe salário, data de admissão e demissão.');
    return;
  }

  // CALCULANDO MESES TRABALHADOS
  const dtAdmissao = new Date(admissao);
  const dtDemissao = new Date(demissao);
  let mesesTrabalhados = (dtDemissao.getFullYear() - dtAdmissao.getFullYear()) * 12;
  mesesTrabalhados += dtDemissao.getMonth() - dtAdmissao.getMonth() + 1;
  if (mesesTrabalhados < 0) mesesTrabalhados = 0;

  // -------------------- SALDO DE SALÁRIO --------------------
  const diasTrabalhadosMesDemissao = dtDemissao.getDate();
  const saldoSalario = (salario / 30) * diasTrabalhadosMesDemissao;

  // -------------------- AVISO PRÉVIO --------------------
  let avisoPrevio = 0;
  if (tipoDemissao === 'semJusta') {
    // Aviso de 30 dias proporcional ao tempo (simplificação)
    avisoPrevio = salario;
  }

  // -------------------- FÉRIAS --------------------
  const feriasProporcionais = salario / 12 * mesesTrabalhados;
  const feriasComUmTerco = feriasProporcionais * 1.3333; // acrescido 1/3

  // -------------------- 13º SALÁRIO --------------------
  const decimoTerceiro = (salario / 12) * mesesTrabalhados;

  // -------------------- FGTS --------------------
  const fgts = (saldoSalario + feriasProporcionais + decimoTerceiro) * 0.08;
  const multaFGTS = tipoDemissao === 'semJusta' ? fgts * 0.4 : 0;

  // -------------------- INSS --------------------
  const baseINSS = saldoSalario + avisoPrevio + feriasComUmTerco + decimoTerceiro;
  let inss = 0;
  if (baseINSS <= 1320) inss = baseINSS * 0.075;
  else if (baseINSS <= 2571.29) inss = baseINSS * 0.09;
  else if (baseINSS <= 3856.94) inss = baseINSS * 0.12;
  else if (baseINSS <= 7507.49) inss = baseINSS * 0.14;
  else inss = 7507.49 * 0.14;

  // -------------------- IRRF --------------------
  const baseIR = baseINSS - inss;
  let ir = 0;
  if (baseIR > 1903.98 && baseIR <= 2826.65) ir = baseIR * 0.075 - 142.8;
  else if (baseIR <= 3751.05) ir = baseIR * 0.15 - 354.8;
  else if (baseIR <= 4664.68) ir = baseIR * 0.225 - 636.13;
  else if (baseIR > 4664.68) ir = baseIR * 0.275 - 869.36;
  if (ir < 0) ir = 0;

  // -------------------- TOTAL LÍQUIDO --------------------
  const totalLiquido = saldoSalario + avisoPrevio + feriasComUmTerco + decimoTerceiro + multaFGTS - inss - ir;

  // -------------------- EXIBIR RESULTADOS --------------------
  const resBox = document.getElementById('resultadoRescisao');
  resBox.style.display = 'block';

  document.getElementById('resSaldo').innerText = `Saldo de Salário: R$ ${saldoSalario.toFixed(2)}`;
  document.getElementById('resAviso').innerText = `Aviso Prévio: R$ ${avisoPrevio.toFixed(2)}`;
  document.getElementById('resFerias').innerText = `Férias + 1/3: R$ ${feriasComUmTerco.toFixed(2)}`;
  document.getElementById('res13').innerText = `13º Proporcional: R$ ${decimoTerceiro.toFixed(2)}`;
  document.getElementById('resFGTS').innerText = `FGTS (8%): R$ ${fgts.toFixed(2)}`;
  document.getElementById('resMulta').innerText = `Multa FGTS (40%): R$ ${multaFGTS.toFixed(2)}`;
  document.getElementById('resINSS').innerText = `INSS: R$ ${inss.toFixed(2)}`;
  document.getElementById('resIR').innerText = `IRRF: R$ ${ir.toFixed(2)}`;
  document.getElementById('resTotal').innerText = `Total Líquido da Rescisão: R$ ${totalLiquido.toFixed(2)}`;

  // -------------------- GRÁFICO DE TORRE --------------------
  const ctx = document.getElementById('graficoRescisao').getContext('2d');
  if (window.graficoRescisao) window.graficoRescisao.destroy();
  window.graficoRescisao = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Saldo', 'Aviso', 'Férias', '13º', 'FGTS', 'Multa FGTS', 'INSS', 'IR'],
      datasets: [{
        label: 'Valores (R$)',
        data: [saldoSalario, avisoPrevio, feriasComUmTerco, decimoTerceiro, fgts, multaFGTS, inss, ir],
        backgroundColor: [
          '#4caf50', '#2196f3', '#ff9800', '#9c27b0', '#00bcd4', '#f44336', '#607d8b', '#795548'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });
}

// -------------------- CALCULADORA DE SEGURO-DESEMPREGO --------------------
function calcularSeguro() {
  const salario = Number(document.getElementById('salarioSeguro').value) || 0;
  const solicitacoes = Number(document.getElementById('solicitacoes').value);

  if (!salario) {
    alert('Informe o último salário.');
    return;
  }

  // -------------------- NORMAS INSS PARA SEGURO --------------------
  let parcelas = 0;
  let valorParcela = 0;

  if (solicitacoes === 0) { // primeira solicitação
    parcelas = salario >= 2000 ? 5 : 4;
  } else if (solicitacoes === 1) {
    parcelas = salario >= 2000 ? 4 : 3;
  } else {
    parcelas = 3;
  }

  // Limite de parcela (simplificado)
  valorParcela = salario * 0.8;
  if (valorParcela > 2200) valorParcela = 2200; // teto aproximado

  const totalSeguro = parcelas * valorParcela;

  const resBox = document.getElementById('resultadoSeguro');
  resBox.style.display = 'block';

  document.getElementById('resParcelas').innerText = `Número de parcelas: ${parcelas}`;
  document.getElementById('resValorParcela').innerText = `Valor por parcela: R$ ${valorParcela.toFixed(2)}`;
  document.getElementById('resTotalSeguro').innerText = `Total aproximado: R$ ${totalSeguro.toFixed(2)}`;
}