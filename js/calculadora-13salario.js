// ================= MENU HAMBÚRGUER =================
function toggleMenu() {
  const menu = document.getElementById('menuLinks');
  if (!menu) return;
  menu.classList.toggle('show');
}

// ================= FORMATAÇÃO BR =================
function formatBR(valor) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

// ================= CALCULADORA 13º SALÁRIO COM DEPENDENTES =================
function calcular13() {
  const salario = Number(document.getElementById('salario')?.value) || 0;
  const meses = Number(document.getElementById('meses')?.value) || 12;
  const horasExtras = Number(document.getElementById('horasExtras')?.value) || 0;
  const insalubridadePerc = Number(document.getElementById('insalubridade')?.value) || 0;
  const periculosidadePerc = Number(document.getElementById('periculosidade')?.value) || 0;
  const dependentes = Number(document.getElementById('dependentes')?.value) || 0;

  if (salario <= 0) {
    alert('Informe o salário.');
    return;
  }

  // Cálculos básicos
  const salarioProporcional = (salario / 12) * meses;
  const adicionalInsalubridade = salarioProporcional * (insalubridadePerc / 100);
  const adicionalPericulosidade = salarioProporcional * (periculosidadePerc / 100);
  const totalBruto = salarioProporcional + horasExtras + adicionalInsalubridade + adicionalPericulosidade;

  // INSS 2026 (tabela atualizada)
  let inss = 0;
  if (totalBruto <= 1412) inss = totalBruto * 0.075;
  else if (totalBruto <= 2666.68) inss = totalBruto * 0.09;
  else if (totalBruto <= 4000.03) inss = totalBruto * 0.12;
  else if (totalBruto <= 7786.02) inss = totalBruto * 0.14;
  else inss = 908.86; // teto INSS

  // IRRF 2026 COM DEDUÇÃO DE DEPENDENTES (R$ 189,59 cada)
  let baseIR = totalBruto - inss;
  const deducaoDependentes = dependentes * 189.59;
  baseIR -= deducaoDependentes;
  if (baseIR < 0) baseIR = 0;

  let ir = 0;
  if (baseIR <= 2259.20) ir = 0; // isenção
  else if (baseIR <= 2826.65) ir = (baseIR * 0.075) - 169.54;
  else if (baseIR <= 3751.05) ir = (baseIR * 0.15) - 381.44;
  else if (baseIR <= 4664.68) ir = (baseIR * 0.225) - 662.66;
  else ir = (baseIR * 0.275) - 896.00;

  if (ir < 0) ir = 0;

  // Parcelas corretas (1ª SEM descontos, 2ª COM descontos)
  const primeiraParcela = totalBruto / 2;
  const segundaParcela = totalBruto - primeiraParcela - inss - ir;
  const totalLiquido = primeiraParcela + segundaParcela;

  const resBox = document.getElementById('resultado13');
  if (!resBox) return;

  resBox.style.display = 'block';
  resBox.innerHTML = `
    <h2>✅ 13º Salário 2026 (LEGAL)</h2>
    <div style="background:#f0f8ff;padding:15px;border-radius:8px;margin:10px 0;">
      <p><strong>Salário proporcional:</strong> ${formatBR(salarioProporcional)}</p>
      <p><strong>Horas extras:</strong> ${formatBR(horasExtras)}</p>
      <p><strong>Insalubridade:</strong> ${formatBR(adicionalInsalubridade)}</p>
      <p><strong>Periculosidade:</strong> ${formatBR(adicionalPericulosidade)}</p>
      <p><strong><strong>Total Bruto:</strong> ${formatBR(totalBruto)}</p>
    </div>
    
    <div style="background:#fff3cd;padding:15px;border-radius:8px;margin:10px 0;">
      <p><strong>INSS:</strong> ${formatBR(inss)}</p>
      <p><strong>Base IR inicial:</strong> ${formatBR(totalBruto - inss)}</p>
      <p><strong>${dependentes} dependente(s):</strong> -${formatBR(deducaoDependentes)}</p>
      <p><strong>Base IR final:</strong> ${formatBR(baseIR)}</p>
      <p><strong>IRRF:</strong> ${formatBR(ir)}</p>
    </div>
    
    <div style="background:#d4edda;padding:15px;border-radius:8px;">
      <p><strong>1ª Parcela (sem desconto):</strong> ${formatBR(primeiraParcela)}</p>
      <p><strong>2ª Parcela (com descontos):</strong> ${formatBR(segundaParcela)}</p>
      <h3>💰 <strong>Total Líquido:</strong> ${formatBR(totalLiquido)}</h3>
    </div>
    <small>📋 Base legal: Lei 4.090/62 + Tabelas INSS/IRRF 2026</small>
  `;
}

// ================= PLANEJAMENTO MÊS A MÊS =================
let grafico13 = null;

function planejar13() {
  const salario = Number(document.getElementById('salarioGraf')?.value) || 0;
  const meses = Number(document.getElementById('mesesGraf')?.value) || 12;
  const percInvest = Number(document.getElementById('percInvest')?.value) || 0;

  if (salario <= 0 || meses <= 0) {
    alert('Informe o salário e os meses trabalhados.');
    return;
  }

  const valorMensal13 = salario / 12;
  const mesesNomes = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

  // Tabela
  const tbody = document.querySelector('#tabelaGraf tbody');
  if (tbody) tbody.innerHTML = '';

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

    if (tbody) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${mesesNomes[i]}</td>
        <td>${formatBR(valor13)}</td>
        <td>${formatBR(valorInvest)}</td>
      `;
      tbody.appendChild(tr);
    }
  }

  document.getElementById('resultadoGraf')?.style.setProperty('display', 'block');

  // Gráfico Chart.js
  const ctx = document.getElementById('graficoMeses')?.getContext('2d');
  if (ctx && grafico13) grafico13.destroy();

  if (ctx) {
    grafico13 = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: mesesNomes,
        datasets: [
          {
            label: '13º acumulado/mês',
            data: dados13,
            backgroundColor: '#3498db'
          },
          {
            label: `Investir (${percInvest}%)`,
            data: dadosInvest,
            backgroundColor: '#2ecc71'
          }
        ]
      },
      options: {
        responsive: true,
        scales: { 
          y: { 
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return 'R$ ' + value.toLocaleString('pt-BR');
              }
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        }
      }
    });
  }
}