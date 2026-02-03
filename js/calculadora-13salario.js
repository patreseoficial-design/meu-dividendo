// js/calculadora-13salario.js

let graf1, graf2;

function calcular13Salario() {
  // PEGANDO OS ELEMENTOS
  const salario = +document.getElementById('salario').value;
  const mesesTrabalhados = +document.getElementById('mesesTrabalhados').value;

  // VALIDAÇÃO
  if (mesesTrabalhados < 1 || mesesTrabalhados > 12) {
    alert('Informe um número de meses entre 1 e 12.');
    return;
  }

  // CÁLCULO DO 13º SALÁRIO PROPORCIONAL
  const decimoTerceiro = (salario / 12) * mesesTrabalhados;

  // MOSTRA RESULTADO
  const res = document.getElementById('resultadoResumo');
  res.style.display = 'block';
  document.getElementById('resTotalFinal').innerText = `13º Salário: R$ ${decimoTerceiro.toFixed(2)}`;

  // TABELA DETALHADA (opcional)
  const tbody = document.querySelector('#tabela tbody');
  tbody.innerHTML = '';
  for (let i = 1; i <= mesesTrabalhados; i++) {
    tbody.innerHTML += `
      <tr>
        <td>${i}</td>
        <td>R$ ${(salario / 12).toFixed(2)}</td>
      </tr>`;
  }

  document.getElementById('resultado').style.display = 'block';

  // GRÁFICO OPCIONAL
  if (graf1) graf1.destroy();
  graf1 = new Chart(document.getElementById('graficoComparativo'), {
    type: 'bar',
    data: {
      labels: Array.from({ length: mesesTrabalhados }, (_, i) => `Mês ${i+1}`),
      datasets: [
        { 
          label: 'Valor Mensal', 
          data: Array(mesesTrabalhados).fill((salario / 12).toFixed(2)), 
          backgroundColor: 'rgba(255, 105, 180, 0.7)' // rosa
        }
      ]
    },
    options: {
      plugins: {
        legend: { display: false }
      }
    }
  });
}