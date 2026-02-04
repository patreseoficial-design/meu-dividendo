let grafico;

function toggleMenu() {
  const menu = document.getElementById('menuLinks');
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

function calcularInvestimento() {
  const salario = Number(document.getElementById('salarioMensal').value) || 0;

  if (salario <= 0) {
    alert('Informe um salário válido.');
    return;
  }

  const despesas = salario * 0.5;
  const investimento = salario * 0.3;
  const reserva = salario * 0.2;

  document.getElementById('resultadoInvest').style.display = 'block';

  document.getElementById('resDespesa').innerText =
    `Despesas: R$ ${despesas.toFixed(2)}`;

  document.getElementById('resInvest').innerText =
    `Investimentos: R$ ${investimento.toFixed(2)}`;

  document.getElementById('resReserva').innerText =
    `Reserva / Dívidas: R$ ${reserva.toFixed(2)}`;

  document.getElementById('tdDespesa').innerText = `R$ ${despesas.toFixed(2)}`;
  document.getElementById('tdInvest').innerText = `R$ ${investimento.toFixed(2)}`;
  document.getElementById('tdReserva').innerText = `R$ ${reserva.toFixed(2)}`;

  const ctx = document.getElementById('graficoInvest');

  if (grafico) grafico.destroy();

  grafico = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Despesas', 'Investimentos', 'Reserva'],
      datasets: [{
        data: [despesas, investimento, reserva],
        backgroundColor: ['#ff7675', '#74b9ff', '#55efc4']
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