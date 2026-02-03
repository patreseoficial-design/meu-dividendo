let graf1; // opcional futuramente se quiser gráficos do 13º

function calcular13() {
  // PEGANDO ELEMENTOS
  const salarioBruto = +document.getElementById('salario').value || 0;
  const mesesTrabalhados = +document.getElementById('meses').value || 0;
  const horasExtras = +document.getElementById('horasExtras').value || 0;
  const insalubridadePerc = +document.getElementById('insalubridade').value || 0;
  const periculosidadePerc = +document.getElementById('periculosidade').value || 0;

  // 1️⃣ Salário proporcional pelos meses trabalhados
  let salarioProporcional = (salarioBruto / 12) * mesesTrabalhados;

  // 2️⃣ Adicionais
  const adicionalHorasExtras = horasExtras;
  const adicionalInsalubridade = salarioProporcional * (insalubridadePerc / 100);
  const adicionalPericulosidade = salarioProporcional * (periculosidadePerc / 100);

  const salarioComAdicionais = salarioProporcional + adicionalHorasExtras + adicionalInsalubridade + adicionalPericulosidade;

  // 3️⃣ INSS (teto até 7507,49)
  let inss;
  if (salarioComAdicionais <= 1320) inss = salarioComAdicionais * 0.075;
  else if (salarioComAdicionais <= 2571.29) inss = salarioComAdicionais * 0.09;
  else if (salarioComAdicionais <= 3856.94) inss = salarioComAdicionais * 0.12;
  else if (salarioComAdicionais <= 7507.49) inss = salarioComAdicionais * 0.14;
  else inss = 7507.49 * 0.14;

  // 4️⃣ Base IRRF
  const baseIR = salarioComAdicionais - inss;

  // 5️⃣ IRRF
  let ir = 0;
  if (baseIR <= 1903.98) ir = 0;
  else if (baseIR <= 2826.65) ir = baseIR * 0.075 - 142.8;
  else if (baseIR <= 3751.05) ir = baseIR * 0.15 - 354.8;
  else if (baseIR <= 4664.68) ir = baseIR * 0.225 - 636.13;
  else ir = baseIR * 0.275 - 869.36;
  if (ir < 0) ir = 0;

  // 6️⃣ Parcelas
  const primeiraParcela = salarioProporcional; // 1ª parcela sem descontos
  const segundaParcela = salarioComAdicionais - inss - ir; // 2ª parcela líquida
  const totalLiquido = primeiraParcela + segundaParcela;

  // 7️⃣ Exibir resultados
  const resBox = document.getElementById('resultado13');
  resBox.style.display = 'block';

  resBox.innerHTML = `
    <h2>Resultado do 13º Salário</h2>
    <p>Salário proporcional: R$ ${salarioProporcional.toFixed(2)}</p>
    <p>Horas Extras: R$ ${adicionalHorasExtras.toFixed(2)}</p>
    <p>Insalubridade: R$ ${adicionalInsalubridade.toFixed(2)}</p>
    <p>Periculosidade: R$ ${adicionalPericulosidade.toFixed(2)}</p>
    <p>Salário com adicionais: R$ ${salarioComAdicionais.toFixed(2)}</p>
    <p>INSS: R$ ${inss.toFixed(2)}</p>
    <p>IRRF: R$ ${ir.toFixed(2)}</p>
    <p>1ª Parcela Líquida: R$ ${primeiraParcela.toFixed(2)}</p>
    <p>2ª Parcela Líquida: R$ ${segundaParcela.toFixed(2)}</p>
    <h3>Total Líquido do 13º: R$ ${totalLiquido.toFixed(2)}</h3>
  `;
}