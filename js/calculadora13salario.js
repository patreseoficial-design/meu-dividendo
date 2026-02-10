let totalLiquido13 = 0;
let grafico;

/* ================= CÁLCULO 13º ================= */
function calcular13() {
  const salario = Number(document.getElementById('salario').value) || 0;
  const meses = Number(document.getElementById('meses').value) || 12;
  const horasExtras = Number(document.getElementById('horasExtras').value) || 0;

  const salarioBase = salario + horasExtras;
  const bruto = (salarioBase / 12) * meses;

  // descontos simplificados
  const inss = bruto * 0.08;
  const ir = bruto * 0.075;

  totalLiquido13 = bruto - inss - ir;

  const parcela1 = bruto / 2;
  const parcela2 = totalLiquido13 - parcela1;

  document.getElementById('resultado13').innerHTML = `
    <p><strong>Valor Bruto:</strong> R$ ${bruto.toFixed(2)}</p>
    <p><strong>INSS:</strong> R$ ${inss.toFixed(2)}</p>
    <p><strong>IR:</strong> R$ ${ir.toFixed(2)}</p>
    <p><strong>1ª Parcela:</strong> R$ ${parcela1.toFixed(2)}</p>
    <p><strong>2ª Parcela:</strong> R$ ${parcela2.toFixed(2)}</p>
    <p><strong>Total Líquido:</strong> R$ ${totalLiquido13.toFixed(2)}</p>
  `;
}

/* ================= PLANEJAMENTO ================= */
function planejar13() {
  if (totalLiquido13 <= 0) {
    alert('Calcule o 13º salário primeiro.');
    return;
  }

  const percInvest = Number(document.getElementById('percInvest').value) || 0;
  const valorInvestir = totalLiquido13 * (percInvest / 100);
  const valorMensal = valorInvestir / 12;

  const tbody = document.getElementById('tabelaPlanejamento');
  tbody.innerHTML = '';

  const labels = [];
  const dados = [];

  for (let i = 1; i <= 12; i++) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i}</td>
      <td>R$ ${valorMensal.toFixed(2)}</td>
    `;
    tbody.appendChild(tr);

    labels.push(`Mês ${i}`);
    dados.push(valorMensal.toFixed(2));
  }

  const ctx = document.getElementById('grafico13');

  if (grafico) grafico.destroy();

  grafico = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        data: dados,
        label: 'Valor investido por mês'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  });
}