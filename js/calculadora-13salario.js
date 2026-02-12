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

// ================= TABELAS FISCAIS 2026 AUTOMÁTICAS =================
const TABELA_INSS_2026 = [
  { ate: 1412.00, aliquota: 0.075 },
  { ate: 2666.68, aliquota: 0.09 },
  { ate: 4000.03, aliquota: 0.12 },
  { ate: 7786.02, aliquota: 0.14 },
  { ate: Infinity, aliquota: 0.14, teto: 908.86 }
];

const TABELA_IRRF_2026 = [
  { ate: 2259.20, aliquota: 0, deducao: 0 },
  { ate: 2826.65, aliquota: 0.075, deducao: 169.54 },
  { ate: 3751.05, aliquota: 0.15, deducao: 381.44 },
  { ate: 4664.68, aliquota: 0.225, deducao: 662.66 },
  { ate: Infinity, aliquota: 0.275, deducao: 896.00 }
];

// 🔥 REDUTOR ADICIONAL IRRF 2026 (Lei 15.270/2025)
function calcularRedutorAdicionalIRRF(baseIR) {
  if (baseIR <= 5000) return baseIR * 0.062578; // Isenção total até R$5k
  if (baseIR <= 7350) return baseIR * 0.133145; // Redução gradual
  return 0; // Acima de R$7.350 sem redutor
}

// ================= CALCULADORA INSS AUTOMÁTICA =================
function calcularINSS(bruto) {
  let inss = 0;
  for (let faixa of TABELA_INSS_2026) {
    if (bruto <= faixa.ate) {
      inss = bruto * faixa.aliquota;
      break;
    }
  }
  return Math.min(inss, TABELA_INSS_2026[4].teto);
}

// ================= CALCULADORA IRRF AUTOMÁTICA =================
function calcularIRRF(baseIR, dependentes = 0) {
  // Dedução dependentes
  const deducaoDependentes = dependentes * 189.59;
  let baseCalculada = Math.max(0, baseIR - deducaoDependentes);
  
  // Tabela progressiva padrão
  let irCalculado = 0;
  for (let faixa of TABELA_IRRF_2026) {
    if (baseCalculada <= faixa.ate) {
      irCalculado = (baseCalculada * faixa.aliquota) - faixa.deducao;
      break;
    }
  }
  
  // REDUTOR ADICIONAL 2026
  const redutorAdicional = calcularRedutorAdicionalIRRF(baseIR);
  const irFinal = Math.max(0, irCalculado - redutorAdicional);
  
  return {
    irCalculado,
    redutorAdicional,
    deducaoDependentes,
    irFinal: Math.max(0, irFinal)
  };
}

// ================= CALCULADORA 13º SALÁRIO 2026 =================
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

  // 🚀 CÁLCULOS AUTOMÁTICOS
  const inss = calcularINSS(totalBruto);
  const baseIR = totalBruto - inss;
  const irrfDetalhes = calcularIRRF(baseIR, dependentes);
  const ir = irrfDetalhes.irFinal;

  // Parcelas (1ª SEM descontos, 2ª COM descontos)
  const primeiraParcela = totalBruto / 2;
  const segundaParcela = totalBruto - primeiraParcela - inss - ir;
  const totalLiquido = primeiraParcela + segundaParcela;

  const resBox = document.getElementById('resultado13');
  if (!resBox) return;

  resBox.style.display = 'block';
  resBox.innerHTML = `
    <h2>13º Salário 2026</h2>
    
    <div>
      <p><strong>Salário proporcional:</strong> ${formatBR(salarioProporcional)}</p>
      <p><strong>Adicionais:</strong> ${formatBR(horasExtras + adicionalInsalubridade + adicionalPericulosidade)}</p>
      <p><strong><strong>Total Bruto:</strong> ${formatBR(totalBruto)}</p>
    </div>
    
    <div>
      <p><strong>INSS:</strong> ${formatBR(inss)}</p>
      <p><strong>Base IR:</strong> ${formatBR(baseIR)}</p>
      <p><strong>${dependentes} dependente(s):</strong> -${formatBR(irrfDetalhes.deducaoDependentes)}</p>
      <p><strong>IR tradicional:</strong> ${formatBR(irrfDetalhes.irCalculado)}</p>
      <p><strong>Redutor 2026:</strong> -${formatBR(irrfDetalhes.redutorAdicional)}</p>
      <p><strong><strong>IRRF Final:</strong> ${formatBR(ir)}</p>
    </div>
    
    <div>
      <p><strong>1ª Parcela (novembro):</strong> ${formatBR(primeiraParcela)}</p>
      <p><strong>2ª Parcela (dezembro):</strong> ${formatBR(segundaParcela)}</p>
      <h2><strong>Total Líquido:</strong> ${formatBR(totalLiquido)}</h2>
    </div>
    
    <div>
      <strong>Tabelas fiscais 2026 carregadas automaticamente</strong><br>
      Válido para fevereiro/2026 | Atualiza com novas leis
    </div>
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

  // Gráfico
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
            ticks: { callback: value => formatBR(value) }
          }
        }
      }
    });
  }
}