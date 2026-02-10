function formatar(valor) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

function calcularINSS(valor) {
  // Regra simples aproximada
  if (valor <= 1412) return valor * 0.075;
  if (valor <= 2666.68) return valor * 0.09;
  if (valor <= 4000.03) return valor * 0.12;
  return valor * 0.14;
}

function calcularIR(valor) {
  // Base simplificada
  if (valor <= 2259.20) return 0;
  if (valor <= 2826.65) return valor * 0.075;
  if (valor <= 3751.05) return valor * 0.15;
  if (valor <= 4664.68) return valor * 0.225;
  return valor * 0.275;
}

let valorLiquidoGlobal = 0;

function calcular13() {
  const salario = Number(document.getElementById('salario').value);
  const meses = Number(document.getElementById('meses').value);

  if (!salario || !meses) {
    alert("Preencha salário e meses trabalhados");
    return;
  }

  const bruto = (salario / 12) * meses;
  const inss = calcularINSS(bruto);
  const ir = calcularIR(bruto - inss);

  const liquido = bruto - inss - ir;

  const parcela1 = bruto / 2;
  const parcela2 = liquido - parcela1;

  valorLiquidoGlobal = liquido;

  document.getElementById('resBruto').innerText = formatar(bruto);
  document.getElementById('resINSS').innerText = formatar(inss);
  document.getElementById('resIR').innerText = formatar(ir);
  document.getElementById('resParcela1').innerText = formatar(parcela1);
  document.getElementById('resParcela2').innerText = formatar(parcela2);
  document.getElementById('resLiquido').innerText = formatar(liquido);
}

function planejarInvestimento() {
  const meses = Number(document.getElementById('mesesInvestir').value);

  if (!valorLiquidoGlobal) {
    alert("Calcule o 13º primeiro");
    return;
  }

  if (!meses) {
    alert("Informe em quantos meses deseja investir");
    return;
  }

  const mensal = valorLiquidoGlobal / meses;
  document.getElementById('resMensalInvest').innerText = formatar(mensal);
}
function calcular13() {
  const salario = Number(document.getElementById('salario').value) || 0;
  const meses = Number(document.getElementById('meses').value) || 0;

  const horasExtras = Number(document.getElementById('horasExtras').value) || 0;
  const insalubridadePerc = Number(document.getElementById('insalubridade').value) || 0;
  const periculosidadePerc = Number(document.getElementById('periculosidade').value) || 0;

  if (!salario || !meses) {
    alert("Preencha salário e meses trabalhados");
    return;
  }

  // adicionais
  const adicionalInsal = salario * (insalubridadePerc / 100);
  const adicionalPeric = salario * (periculosidadePerc / 100);

  // remuneração mensal real
  const remuneracaoMensal =
    salario +
    horasExtras +
    adicionalInsal +
    adicionalPeric;

  // cálculo do 13º
  const bruto = (remuneracaoMensal / 12) * meses;

  const inss = calcularINSS(bruto);
  const ir = calcularIR(bruto - inss);

  const liquido = bruto - inss - ir;

  const parcela1 = bruto / 2;
  const parcela2 = liquido - parcela1;

  valorLiquidoGlobal = liquido;

  document.getElementById('resBruto').innerText = formatar(bruto);
  document.getElementById('resINSS').innerText = formatar(inss);
  document.getElementById('resIR').innerText = formatar(ir);
  document.getElementById('resParcela1').innerText = formatar(parcela1);
  document.getElementById('resParcela2').innerText = formatar(parcela2);
  document.getElementById('resLiquido').innerText = formatar(liquido);
}