// ===== MENU HAMBÚRGUER =====
function toggleMenu() {
  const menu = document.getElementById('menuLinks');
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// ===== CALCULADORA 13º SALÁRIO =====
let graf1; // futuramente para gráficos se quiser

+ function calcular13() {
  // 🔹 FUNÇÃO AUXILIAR SEGURA
  function getValue(id) {
    const el = document.getElementById(id);
    if (!el) return 0;
    const v = Number(el.value);
    return isNaN(v) ? 0 : v;
  }

  // CAMPOS (TODOS OPCIONAIS)
  const salario = getValue('salario');
  const meses = getValue('meses');

  const horasExtras = getValue('horasExtras');
  const insalubridadePerc = getValue('insalubridade');
  const periculosidadePerc = getValue('periculosidade');

  // 🔹 SE NÃO INFORMAR MESES, CONSIDERA 12
  const mesesTrabalhados = meses > 0 ? meses : 12;

  // 1️⃣ SALÁRIO PROPORCIONAL
  const salarioProporcional = salario > 0
    ? (salario / 12) * mesesTrabalhados
    : 0;

  // 2️⃣ ADICIONAIS
  const adicionalInsalubridade =
    salarioProporcional * (insalubridadePerc / 100);

  const adicionalPericulosidade =
    salarioProporcional * (periculosidadePerc / 100);

  const salarioComAdicionais =
    salarioProporcional +
    horasExtras +
    adicionalInsalubridade +
    adicionalPericulosidade;

  // 3️⃣ INSS
  let inss = 0;
  if (salarioComAdicionais <= 1320) inss = salarioComAdicionais * 0.075;
  else if (salarioComAdicionais <= 2571.29) inss = salarioComAdicionais * 0.09;
  else if (salarioComAdicionais <= 3856.94) inss = salarioComAdicionais * 0.12;
  else if (salarioComAdicionais <= 7507.49) inss = salarioComAdicionais * 0.14;
  else inss = 7507.49 * 0.14;

  // 4️⃣ IRRF
  const baseIR = salarioComAdicionais - inss;
  let ir = 0;

  if (baseIR > 1903.98 && baseIR <= 2826.65) ir = baseIR * 0.075 - 142.8;
  else if (baseIR <= 3751.05) ir = baseIR * 0.15 - 354.8;
  else if (baseIR <= 4664.68) ir = baseIR * 0.225 - 636.13;
  else if (baseIR > 4664.68) ir = baseIR * 0.275 - 869.36;

  if (ir < 0) ir = 0;

  // 5️⃣ PARCELAS
  const primeiraParcela = salarioProporcional / 2;
  const segundaParcela = salarioComAdicionais - inss - ir;
  const totalLiquido = primeiraParcela + segundaParcela;

  // 6️⃣ EXIBIR RESULTADO (SEM QUEBRAR SE NÃO EXISTIR)
  const resBox = document.getElementById('resultado13');
  if (!resBox) return;

  resBox.style.display = 'block';
  resBox.innerHTML = `
    <h2>Resultado do 13º Salário</h2>

    <p><strong>Salário proporcional:</strong> R$ ${salarioProporcional.toFixed(2)}</p>
    <p><strong>Horas extras:</strong> R$ ${horasExtras.toFixed(2)}</p>
    <p><strong>Insalubridade:</strong> R$ ${adicionalInsalubridade.toFixed(2)}</p>
    <p><strong>Periculosidade:</strong> R$ ${adicionalPericulosidade.toFixed(2)}</p>

    <p><strong>INSS:</strong> R$ ${inss.toFixed(2)}</p>
    <p><strong>IRRF:</strong> R$ ${ir.toFixed(2)}</p>

    <hr>

    <p><strong>1ª Parcela:</strong> R$ ${primeiraParcela.toFixed(2)}</p>
    <p><strong>2ª Parcela:</strong> R$ ${segundaParcela.toFixed(2)}</p>

    <h3>Total Líquido do 13º: R$ ${totalLiquido.toFixed(2)}</h3>
  `;
}

// ===== PLANEJAMENTO MÊS A MÊS =====
let grafico13 = null;

function planejar13() {
  const salario = Number(document.getElementById('salarioGraf').value) || 0;
  const meses = Number(document.getElementById('mesesGraf').value) || 0;
  const percInvest = Number(document.getElementById('percInvest').value) || 0;

  if (salario <= 0 || meses <= 0) {
    alert('Informe o salário e os meses trabalhados.');
    return;
  }

  const valorMensal13 = salario / 12;
  const mesesNomes = [
    'Jan','Fev','Mar','Abr','Mai','Jun',
    'Jul','Ago','Set','Out','Nov','Dez'
  ];

  const tbody = document.querySelector('#tabelaGraf tbody');
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

    dados13.push(valor13.toFixed(2));
    dadosInvest.push(valorInvest.toFixed(2));

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${mesesNomes[i]}</td>
      <td>R$ ${valor13.toFixed(2)}</td>
      <td>R$ ${valorInvest.toFixed(2)}</td>
    `;
    tbody.appendChild(tr);
  }

  document.getElementById('resultadoGraf').style.display = 'block';

  // DESTROI GRÁFICO ANTIGO (evita bug)
  if (grafico13) {
    grafico13.destroy();
  }

  const ctx = document.getElementById('graficoMeses').getContext('2d');

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
      plugins: {
        legend: {
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}
function calcular13() {
  const salario = Number(document.getElementById('salario')?.value) || 0;
  const meses = Number(document.getElementById('meses')?.value) || 0;

  const horasExtras = Number(document.getElementById('horasExtras')?.value) || 0;
  const insalubridadePerc = Number(document.getElementById('insalubridade')?.value) || 0;
  const periculosidadePerc = Number(document.getElementById('periculosidade')?.value) || 0;

  if (salario === 0 || meses === 0) {
    alert('Informe pelo menos o salário e os meses.');
    return;
  }

  const salarioProporcional = (salario / 12) * meses;

  const adicionalInsalubridade = salarioProporcional * (insalubridadePerc / 100);
  const adicionalPericulosidade = salarioProporcional * (periculosidadePerc / 100);

  const salarioComAdicionais =
    salarioProporcional +
    horasExtras +
    adicionalInsalubridade +
    adicionalPericulosidade;

  let inss = 0;
  if (salarioComAdicionais <= 1320) inss = salarioComAdicionais * 0.075;
  else if (salarioComAdicionais <= 2571.29) inss = salarioComAdicionais * 0.09;
  else if (salarioComAdicionais <= 3856.94) inss = salarioComAdicionais * 0.12;
  else if (salarioComAdicionais <= 7507.49) inss = salarioComAdicionais * 0.14;
  else inss = 7507.49 * 0.14;

  const baseIR = salarioComAdicionais - inss;
  let ir = 0;

  if (baseIR > 1903.98 && baseIR <= 2826.65) ir = baseIR * 0.075 - 142.8;
  else if (baseIR <= 3751.05) ir = baseIR * 0.15 - 354.8;
  else if (baseIR <= 4664.68) ir = baseIR * 0.225 - 636.13;
  else if (baseIR > 4664.68) ir = baseIR * 0.275 - 869.36;

  if (ir < 0) ir = 0;

  const primeiraParcela = salarioProporcional / 2;
  const segundaParcela = salarioComAdicionais - inss - ir;
  const totalLiquido = primeiraParcela + segundaParcela;

  let resBox = document.getElementById('resultado13');

  // 👉 cria automaticamente se não existir
  if (!resBox) {
    resBox = document.createElement('div');
    resBox.id = 'resultado13';
    resBox.className = 'result';
    document.body.appendChild(resBox);
  }

  resBox.style.display = 'block';
  resBox.innerHTML = `
    <h2>Resultado do 13º Salário</h2>
    <p><strong>Salário proporcional:</strong> R$ ${salarioProporcional.toFixed(2)}</p>
    <p><strong>Horas extras:</strong> R$ ${horasExtras.toFixed(2)}</p>
    <p><strong>Insalubridade:</strong> R$ ${adicionalInsalubridade.toFixed(2)}</p>
    <p><strong>Periculosidade:</strong> R$ ${adicionalPericulosidade.toFixed(2)}</p>
    <p><strong>INSS:</strong> R$ ${inss.toFixed(2)}</p>
    <p><strong>IRRF:</strong> R$ ${ir.toFixed(2)}</p>
    <hr>
    <p><strong>1ª Parcela:</strong> R$ ${primeiraParcela.toFixed(2)}</p>
    <p><strong>2ª Parcela:</strong> R$ ${segundaParcela.toFixed(2)}</p>
    <h3>Total Líquido: R$ ${totalLiquido.toFixed(2)}</h3>
  `;
}