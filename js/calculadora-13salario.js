let graf1; // se quiser futuramente gráficos do 13º, mas opcional

function calcular13() {
  // PEGANDO ELEMENTOS
  const salarioBruto = +document.getElementById('salario').value;
  const mesesTrabalhados = +document.getElementById('meses').value;

  // 1️⃣ Valor proporcional
  let valorProporcional = (salarioBruto / 12) * mesesTrabalhados;

  // 2️⃣ INSS
  let inss;
  if (salarioBruto <= 1320) inss = salarioBruto * 0.075;
  else if (salarioBruto <= 2571.29) inss = salarioBruto * 0.09;
  else if (salarioBruto <= 3856.94) inss = salarioBruto * 0.12;
  else if (salarioBruto <= 7507.49) inss = salarioBruto * 0.14;
  else inss = 7507.49 * 0.14; // teto INSS

  // 3️⃣ Base para IRRF
  const baseIR = valorProporcional - inss;

  // 4️⃣ IRRF
  let ir = 0;
  if (baseIR <= 1903.98) ir = 0;
  else if (baseIR <= 2826.65) ir = baseIR * 0.075 - 142.8;
  else if (baseIR <= 3751.05) ir = baseIR * 0.15 - 354.8;
  else if (baseIR <= 4664.68) ir = baseIR * 0.225 - 636.13;
  else ir = baseIR * 0.275 - 869.36;
  if (ir < 0) ir = 0; // evita IR negativo

  // 5️⃣ Parcelas
  const primeiraParcela = valorProporcional - inss; // sem IR
  const segundaParcela = valorProporcional - inss - ir;
  const totalLiquido = primeiraParcela + segundaParcela;

  // MOSTRAR RESULTADOS
  const resBox = document.getElementById('resultadoResumo');
  resBox.style.display = 'block';

  document.getElementById('resBruto').innerText = `Salário Bruto: R$ ${salarioBruto.toFixed(2)}`;
  document.getElementById('resProporcional').innerText = `Proporcional: R$ ${valorProporcional.toFixed(2)}`;
  document.getElementById('resINSS').innerText = `INSS: R$ ${inss.toFixed(2)}`;
  document.getElementById('resIR').innerText = `IRRF: R$ ${ir.toFixed(2)}`;
  document.getElementById('resParcela1').innerText = `1ª Parcela Líquida: R$ ${primeiraParcela.toFixed(2)}`;
  document.getElementById('resParcela2').innerText = `2ª Parcela Líquida: R$ ${segundaParcela.toFixed(2)}`;
  document.getElementById('resTotal').innerText = `Total Líquido do 13º: R$ ${totalLiquido.toFixed(2)}`;
}