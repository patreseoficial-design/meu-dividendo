function calcularPIS() {
  const salario = +document.getElementById('salarioPIS').value;
  const meses = +document.getElementById('mesesPIS').value;

  // Valor base do PIS 2026 é R$ 110 (ajuste conforme regras oficiais)
  const valorPIS = 110 * (meses / 12);

  const res = document.getElementById('resultadoPIS');
  res.style.display = 'block';
  res.style.border = '2px solid #111';
  res.style.backgroundColor = '#f9f9f9';

  document.getElementById('resTotalPIS').innerText = `Valor do PIS proporcional: R$ ${valorPIS.toFixed(2)}`;
}