function calcular13() {
  const salario = +document.getElementById('salario').value;
  const meses = +document.getElementById('meses').value;

  const valor13 = salario * (meses / 12);

  // Mostra resultado resumido
  const res = document.getElementById('resultado13');
  res.style.display = 'block';
  res.style.border = '2px solid #111';      // estilo visual
  res.style.backgroundColor = '#f9f9f9';

  document.getElementById('resTotal13').innerText = `Valor do 13º salário proporcional: R$ ${valor13.toFixed(2)}`;
}