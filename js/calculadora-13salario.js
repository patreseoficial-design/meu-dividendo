// ================= MENU HAMBÚRGUER =================
function toggleMenu() {
  const menu = document.getElementById('menuLinks');
  if (!menu) return;
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// ================= FUNÇÃO DE FORMATAÇÃO BR =================
function formatBR(valor) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}
function calcular13() {
  const salario = Number(document.getElementById('salario')?.value) || 0;
  const dataAdmissao = document.getElementById('dataAdmissao')?.value;
  const dataDemissao = document.getElementById('dataDemissao')?.value;

  if (salario <= 0) {
    alert('Informe o salário.');
    return;
  }

  if (!dataAdmissao || !dataDemissao) {
    alert('Informe a data de admissão e demissão.');
    return;
  }

  const admissao = new Date(dataAdmissao);
  const demissao = new Date(dataDemissao);

  // Ano da demissão
  const anoDemissao = demissao.getFullYear();

  // Calcula o mês inicial e final para o 13º
  const mesInicio = admissao.getFullYear() === anoDemissao ? admissao.getMonth() + 1 : 1;
  const mesFim = demissao.getMonth() + 1;

  // Meses trabalhados no ano da demissão
  const meses13 = mesFim - mesInicio + 1;

  // 13° proporcional
  const decimoTerceiro = (salario / 12) * meses13;

  // Mostra na tela (exemplo)
  const resultado13 = document.getElementById('resultado13');
  if (resultado13) {
    resultado13.innerHTML = `
      Meses para 13°: <strong>${meses13} meses</strong><br>
      13° proporcional: <strong>R$ ${decimoTerceiro.toFixed(2)}</strong>
    `;
  }

  console.log(`Meses trabalhados no ano ${anoDemissao}: ${meses13}`);
  console.log(`13° proporcional: R$ ${decimoTerceiro.toFixed(2)}`);
}

  // 1️⃣ Salário proporcional
  const salarioProporcional = (salario / 12) * meses;

  // 2️⃣ Adicionais proporcionais
  const adicionalInsalubridade = salarioProporcional * (insalubridadePerc / 100);
  const adicionalPericulosidade = salarioProporcional * (periculosidadePerc / 100);

  // 3️⃣ Total bruto do 13º
  const totalBruto =
    salarioProporcional +
    horasExtras +
    adicionalInsalubridade +
    adicionalPericulosidade;

  // 4️⃣ Primeira parcela (50% do bruto, SEM descontos)
  const primeiraParcela = totalBruto / 2;

  // 5️⃣ INSS (aplicado sobre o total bruto)
  let inss = 0;
  if (totalBruto <= 1320) inss = totalBruto * 0.075;
  else if (totalBruto <= 2571.29) inss = totalBruto * 0.09;
  else if (totalBruto <= 3856.94) inss = totalBruto * 0.12;
  else if (totalBruto <= 7507.49) inss = totalBruto * 0.14;
  else inss = 7507.49 * 0.14;

  // 6️⃣ IRRF
  const baseIR = totalBruto - inss;
  let ir = 0;

  if (baseIR > 1903.98 && baseIR <= 2826.65) ir = baseIR * 0.075 - 142.8;
  else if (baseIR <= 3751.05) ir = baseIR * 0.15 - 354.8;
  else if (baseIR <= 4664.68) ir = baseIR * 0.225 - 636.13;
  else if (baseIR > 4664.68) ir = baseIR * 0.275 - 869.36;

  if (ir < 0) ir = 0;

  // 7️⃣ Segunda parcela (restante com descontos)
  const segundaParcela = totalBruto - primeiraParcela - inss - ir;

  // 8️⃣ Total líquido correto
  const totalLiquido = totalBruto - inss - ir;

  const resBox = document.getElementById('resultado13');
  if (!resBox) return;

  resBox.style.display = 'block';
  resBox.innerHTML = `
    <h2>Resultado do 13º Salário</h2>

    <p><strong>Salário proporcional:</strong> ${formatBR(salarioProporcional)}</p>
    <p><strong>Horas extras:</strong> ${formatBR(horasExtras)}</p>
    <p><strong>Insalubridade:</strong> ${formatBR(adicionalInsalubridade)}</p>
    <p><strong>Periculosidade:</strong> ${formatBR(adicionalPericulosidade)}</p>

    <p><strong>Total Bruto:</strong> ${formatBR(totalBruto)}</p>

    <p><strong>INSS:</strong> ${formatBR(inss)}</p>
    <p><strong>IRRF:</strong> ${formatBR(ir)}</p>

    <hr>

    <p><strong>1ª Parcela:</strong> ${formatBR(primeiraParcela)}</p>
    <p><strong>2ª Parcela:</strong> ${formatBR(segundaParcela)}</p>

    <h3>Total Líquido do 13º: ${formatBR(totalLiquido)}</h3>
  `;
}
   
// ================= PLANEJAMENTO MÊS A MÊS =================
let grafico13 = null;

function planejar13() {
  const salario = Number(document.getElementById('salarioGraf')?.value) || 0;
  const meses = Number(document.getElementById('mesesGraf')?.value) || 0;
  const percInvest = Number(document.getElementById('percInvest')?.value) || 0;

  if (salario <= 0 || meses <= 0) {
    alert('Informe o salário e os meses trabalhados.');
    return;
  }

  const valorMensal13 = salario / 12;
  const mesesNomes = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

  const tbody = document.querySelector('#tabelaGraf tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  const dados13 = [];
  const dadosInvest = [];

  for (let i = 0; i < 12; i++) {
    let valor13 = 0;
    let valorInvest = 0;

    if (i < meses) {
      valor13 = valorMensal13;
      valorInvest = valor13 * (percInvest / 100);
    }

    dados13.push(valor13);
    dadosInvest.push(valorInvest);

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${mesesNomes[i]}</td>
      <td>${formatBR(valor13)}</td>
      <td>${formatBR(valorInvest)}</td>
    `;
    tbody.appendChild(tr);
  }

  document.getElementById('resultadoGraf')?.style.setProperty('display', 'block');

  if (grafico13) grafico13.destroy();

  const ctx = document.getElementById('graficoMeses')?.getContext('2d');
  if (!ctx) return;

  grafico13 = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: mesesNomes,
      datasets: [
        {
          label: '13º acumulado por mês',
          data: dados13,
          backgroundColor: '#444'
        },
        {
          label: 'Valor para investir',
          data: dadosInvest,
          backgroundColor: '#2ecc71'
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}