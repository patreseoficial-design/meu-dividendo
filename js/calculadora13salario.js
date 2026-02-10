let grafico = null;
let valorLiquidoGlobal = 0;

// ================= UTIL =================
function formatar(valor) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

// ================= INSS =================
function calcularINSS(valor) {
  if (valor <= 1412) return valor * 0.075;
  if (valor <= 2666.68) return valor * 0.09;
  if (valor <= 4000.03) return valor * 0.12;
  return valor * 0.14;
}

// ================= IR =================
function calcularIR(valor) {
  if (valor <= 2259.20) return 0;
  if (valor <= 2826.65) return valor * 0.075;
  if (valor <= 3751.05) return valor * 0.15;
  if (valor <= 4664.68) return valor * 0.225;
  return valor * 0.275;
}

// ================= CALCULAR 13º =================
function calcular13() {
  const salario = Number(document.getElementById('salario').value) || 0;
  const meses = Number(document.getElementById('meses').value) || 0;
  const horasExtras = Number(document.getElementById('horasExtras').value) || 0;
  const insalubridade = Number(document.getElementById('insalubridade').value) || 0;
  const periculosidade = Number(document.getElementById('periculosidade').value) || 0;

  if (!salario || !meses) {
    alert("Preencha salário e meses trabalhados");
    return;
  }

  // adicionais
  const valorInsalubridade = salario * (insalubridade / 100);
  const valorPericulosidade = salario * (periculosidade / 100);

  const adicionais = horasExtras + valorInsalubridade + valorPericulosidade;
  const remuneracaoMensal = salario + adicionais;

  // 13º proporcional
  const bruto = (remuneracaoMensal / 12) * meses;

  const inss = calcularINSS(bruto);
  const ir = calcularIR(bruto - inss);
  const liquido = bruto - inss - ir;

  const parcela1 = bruto / 2;
  const parcela2 = liquido - parcela1;

  valorLiquidoGlobal = liquido;

  // resultados
  document.getElementById('resBruto').innerText = formatar(bruto);
  document.getElementById('resINSS').innerText = formatar(inss);
  document.getElementById('resIR').innerText = formatar(ir);
  document.getElementById('resParcela1').innerText = formatar(parcela1);
  document.getElementById('resParcela2').innerText = formatar(parcela2);
  document.getElementById('resLiquido').innerText = formatar(liquido);

  // detalhamento mês a mês
  gerarDetalhamento(meses, salario, adicionais);
}

// ================= DETALHAMENTO =================
function gerarDetalhamento(meses, salario, adicionais) {
  const tbody = document.querySelector('#tabelaMeses tbody');
  tbody.innerHTML = '';

  const labels = [];
  const dados = [];

  for (let i = 1; i <= meses; i++) {
    const totalMes = salario + adicionais;

    labels.push(`Mês ${i}`);
    dados.push(totalMes);

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>Mês ${i}</td>
      <td>${formatar(salario)}</td>
      <td>${formatar(adicionais)}</td>
      <td>${formatar(totalMes)}</td>
    `;
    tbody.appendChild(tr);
  }

  criarGrafico(labels, dados);
}

// ================= GRÁFICO =================
function criarGrafico(labels, dados) {
  const ctx = document.getElementById('graficoMeses').getContext('2d');

  if (grafico) {
    grafico.destroy();
  }

  grafico = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Remuneração mensal (R$)',
        data: dados,
        backgroundColor: '#2c7be5'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          ticks: {
            callback: value =>
              value.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })
          }
        }
      }
    }
  });
}

// ================= PLANEJAMENTO =================
function planejarInvestimento() {
  const meses = Number(document.getElementById('mesesInvestir').value) || 0;

  if (!valorLiquidoGlobal) {
    alert("Calcule o 13º primeiro");
    return;
  }

  if (!meses) {
    alert("Informe em quantos meses deseja investir");
    return;
  }

  const mensal = valorLiquidoGlobal / meses;
  document.getElementById('resMensalInvest').innerText = formatar(mensal);
}