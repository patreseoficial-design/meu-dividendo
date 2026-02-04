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
let grafPlanejamento;

function planejar13() {
  const salario = +document.getElementById('salarioGraf').value || 0;
  const meses = +document.getElementById('mesesGraf').value || 0;

  const tabelaBody = document.querySelector('#tabelaGraf tbody');
  tabelaBody.innerHTML = '';

  const labels = [], dataDespesas = [], dataInvest = [], dataReserva = [];

  for (let i = 1; i <= meses; i++) {
    const proporcional = salario / 12;
    const desp = proporcional * 0.5;
    const invest = proporcional * 0.3;
    const reserva = proporcional * 0.2;

    tabelaBody.innerHTML += `
      <tr>
        <td>${i}</td>
        <td>R$ ${desp.toFixed(2)}</td>
        <td>R$ ${invest.toFixed(2)}</td>
        <td>R$ ${reserva.toFixed(2)}</td>
      </tr>`;

    labels.push(`Mês ${i}`);
    dataDespesas.push(desp);
    dataInvest.push(invest);
    dataReserva.push(reserva);
  }

  document.getElementById('resultadoGraf').style.display = 'block';

  if (grafPlanejamento) grafPlanejamento.destroy();

  grafPlanejamento = new Chart(document.getElementById('graficoMeses'), {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Despesas (50%)', data: dataDespesas, backgroundColor: '#FF69B4' }, // rosa
        { label: 'Investimento (30%)', data: dataInvest, backgroundColor: '#5bc0eb' }, // azul claro
        { label: 'Reserva / Dívida (20%)', data: dataReserva, backgroundColor: '#90EE90' } // verde claro
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Distribuição mês a mês do 13º Salário' }
      },
      scales: {
        y: { beginAtZero: true }
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