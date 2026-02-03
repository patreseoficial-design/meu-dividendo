function calcularIR() {
  const valor = +document.getElementById('valorIR').value;
  const tipo = document.getElementById('tipoIR').value;

  let aliquota = 0;

  if(tipo === 'acoes') {
    aliquota = 0; // dividendos isentos
  }
  if(tipo === 'fii') {
    aliquota = 0.2; // 20% sobre lucro em FIIs (exemplo)
  }

  const imposto = valor * aliquota;

  const res = document.getElementById('resultadoIR');
  res.style.display = 'block';
  res.style.border = '2px solid #111';
  res.style.backgroundColor = '#f9f9f9';

  document.getElementById('resTotalIR').innerText = `Imposto a pagar: R$ ${imposto.toFixed(2)}`;
}