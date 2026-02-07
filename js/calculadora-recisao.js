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
  const salario = Number(document.getElementById('salario')?.value) || 0;
  const admissao = new Date(document.getElementById('admissao')?.value);
  const demissao = new Date(document.getElementById('demissao')?.value);
  const tipoDemissao = document.getElementById('tipoDemissao')?.value;
  const avisoIndenizado = document.getElementById('avisoIndenizado')?.checked;

  const periculosidadePerc = Number(document.getElementById('periculosidade')?.value) || 0;
  const insalubridadePerc = Number(document.getElementById('insalubridade')?.value) || 0;
  const horasExtras = Number(document.getElementById('horasExtras')?.value) || 0;

  if (!salario || isNaN(admissao) || isNaN(demissao)) {
    alert('Preencha todos os campos corretamente.');
    return;
  }

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

  // ================= FÉRIAS + 1/3 =================
  const feriasProporcionais = (salarioBase / 12) * mesesTrabalhados;
  const feriasComUmTerco = feriasProporcionais * 1.3333;

  // ================= 13º =================
  const decimoTerceiro = (salarioBase / 12) * mesesTrabalhados;

  // ================= FGTS =================
  const totalMeses = Math.floor(
    Math.abs(demissao - admissao) / (1000 * 60 * 60 * 24 * 30)
  );
  const fgts = salarioBase * 0.08 * totalMeses;
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
  document.getElementById('resAviso').innerText = `Aviso prévio: ${formatBRL(avisoPrevio)}`;
  document.getElementById('resFerias').innerText = `Férias + 1/3: ${formatBRL(feriasComUmTerco)}`;
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