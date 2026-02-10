
patreseoficial-design
meu-dividendo
Repository navigation
Code
Issues
Pull requests
Actions
Projects
Wiki
Security
Insights
Settings

 GitHub users are now required to enable two-factor authentication as an additional security measure. Your activity on GitHub includes you in this requirement. You will need to enable two-factor authentication on your account before March 07, 2026, or be restricted from account actions.

Commit 90818de
patreseoficial-design
patreseoficial-design
authored
4 days ago
·
·
Verified
Atualizar o calculadora-13salario.js
main
1 parent 
2dd1bab
 commit 
90818de
File tree
Filter files…
js
calculadora-13salario.js
1 file changed
+25
-21
lines changed
Search within code
 
‎js/calculadora-13salario.js‎
+25
-21
Lines changed: 25 additions & 21 deletions
Original file line number	Diff line number	Diff line change
@@ -1,167 +1,171 @@
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
// ================= CALCULADORA 13º SALÁRIO =================
function calcular13() {
  const salario = Number(document.getElementById('salario')?.value) || 0;
  const meses = Number(document.getElementById('meses')?.value) || 0;
  const meses = Number(document.getElementById('meses')?.value) || 12;

  const horasExtras = Number(document.getElementById('horasExtras')?.value) || 0;
  const insalubridadePerc = Number(document.getElementById('insalubridade')?.value) || 0;
  const periculosidadePerc = Number(document.getElementById('periculosidade')?.value) || 0;

  if (salario <= 0) {
    alert('Informe o salário.');
    return;
  }

  const mesesTrabalhados = meses > 0 ? meses : 12;
  // Salário proporcional
  const salarioProporcional = (salario / 12) * mesesTrabalhados;
  // 1️⃣ Salário proporcional
  const salarioProporcional = (salario / 12) * meses;

  // Adicionais
  // 2️⃣ Adicionais proporcionais
  const adicionalInsalubridade = salarioProporcional * (insalubridadePerc / 100);
  const adicionalPericulosidade = salarioProporcional * (periculosidadePerc / 100);

  const salarioComAdicionais =
  // 3️⃣ Total bruto do 13º
  const totalBruto =
    salarioProporcional +
    horasExtras +
    adicionalInsalubridade +
    adicionalPericulosidade;

  // INSS
  // 4️⃣ Primeira parcela (50% do bruto, SEM descontos)
  const primeiraParcela = totalBruto / 2;
  // 5️⃣ INSS (aplicado sobre o total bruto)
  let inss = 0;
  if (salarioComAdicionais <= 1320) inss = salarioComAdicionais * 0.075;
  else if (salarioComAdicionais <= 2571.29) inss = salarioComAdicionais * 0.09;
  else if (salarioComAdicionais <= 3856.94) inss = salarioComAdicionais * 0.12;
  else if (salarioComAdicionais <= 7507.49) inss = salarioComAdicionais * 0.14;
  if (totalBruto <= 1320) inss = totalBruto * 0.075;
  else if (totalBruto <= 2571.29) inss = totalBruto * 0.09;
  else if (totalBruto <= 3856.94) inss = totalBruto * 0.12;
  else if (totalBruto <= 7507.49) inss = totalBruto * 0.14;
  else inss = 7507.49 * 0.14;

  // IRRF
  const baseIR = salarioComAdicionais - inss;
  // 6️⃣ IRRF
  const baseIR = totalBruto - inss;
  let ir = 0;

  if (baseIR > 1903.98 && baseIR <= 2826.65) ir = baseIR * 0.075 - 142.8;
  else if (baseIR <= 3751.05) ir = baseIR * 0.15 - 354.8;
  else if (baseIR <= 4664.68) ir = baseIR * 0.225 - 636.13;
  else if (baseIR > 4664.68) ir = baseIR * 0.275 - 869.36;

  if (ir < 0) ir = 0;

  // Parcelas
  const primeiraParcela = salarioProporcional / 2;
  const segundaParcela = salarioComAdicionais - inss - ir;
  const totalLiquido = primeiraParcela + segundaParcela;
  // 7️⃣ Segunda parcela (restante com descontos)
  const segundaParcela = totalBruto - primeiraParcela - inss - ir;

  let resBox = document.getElementById('resultado13');
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