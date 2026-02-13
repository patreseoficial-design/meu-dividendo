let grafico;

document.getElementById('calcular').addEventListener('click', function() {
  // Pega os valores dos inputs
  const salario = parseFloat(document.getElementById('salario').value);
  const objetivo = parseFloat(document.getElementById('objetivo').value);
  const anos = parseFloat(document.getElementById('tempo').value);
  const jurosAno = parseFloat(document.getElementById('juros').value);

  if(!salario || !objetivo || !anos || !jurosAno) {
    alert('Preencha todos os campos corretamente!');
    return;
  }

  // Calcula aporte mensal usando juros compostos
  const meses = anos * 12;
  const jurosMensal = Math.pow(1 + jurosAno/100, 1/12) - 1;
  const aporteMensal = objetivo * jurosMensal / (Math.pow(1 + jurosMensal, meses) - 1);

  // Sugestão de divisão do salário
  const despesas = salario * 0.5;
  const reserva = salario * 0.2;
  const investimento = Math.min(salario * 0.3, aporteMensal);

  // Exibir resultado
  const resultadoDiv = document.getElementById('resultado');
  resultadoDiv.style.display = 'block';
  resultadoDiv.innerHTML = `
    Você precisa investir aproximadamente <strong>R$ ${aporteMensal.toFixed(2)}</strong> por mês para atingir <strong>R$ ${objetivo.toLocaleString('pt-BR')}</strong> em ${anos} anos.<br><br>
    Divisão sugerida do seu salário:<br>
    Despesas: R$ ${despesas.toFixed(2)}<br>
    Investimento: R$ ${investimento.toFixed(2)}<br>
    Reserva / Dívidas: R$ ${reserva.toFixed(2)}
  `;

  // Gráfico de barras
  const ctx = document.getElementById('graficoInvest');
  if (grafico) grafico.destroy();

  grafico = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Despesas', 'Investimento', 'Reserva'],
      datasets: [{
        data: [despesas, investimento, reserva],
        backgroundColor: ['#ff7675', '#74b9ff', '#55efc4']
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });
});