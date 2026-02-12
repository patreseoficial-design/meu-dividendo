function calcularIRAvancado() {
  // 1️⃣ Pegando valores do HTML
  const tipo = document.getElementById("tipoInvestimento").value;
  const operacao = document.getElementById("tipoOperacao").value;
  const precoCompra = parseFloat(document.getElementById("precoCompra").value) || 0;
  const quantidade = parseFloat(document.getElementById("quantidade").value) || 0;
  const precoVenda = parseFloat(document.getElementById("precoVenda").value) || 0;
  const dividendosInput = document.getElementById("dividendos").value || "";
  const jcp = parseFloat(document.getElementById("jcp").value) || 0;
  const juros = parseFloat(document.getElementById("juros").value) || 0;
  const custos = parseFloat(document.getElementById("custos").value) || 0;
  const dataCompra = document.getElementById("dataCompra").value;
  const dataResgate = document.getElementById("dataResgate").value;
  let prejuizos = parseFloat(document.getElementById("prejuizos").value) || 0;

  let totalIR = 0;

  // -------------------------
  // 2️⃣ Dividendos 2026
  // formato: empresa:mês:valor
  // -------------------------
  if (dividendosInput) {
    const dividendosArr = dividendosInput.split(",");
    dividendosArr.forEach(item => {
      const [empresa, mesStr, valorStr] = item.split(":");
      const valor = parseFloat(valorStr);
      if (valor > 50000) {
        totalIR += (valor - 50000) * 0.10;
      }
    });
  }

  // -------------------------
  // 3️⃣ JCP (15%)
  // -------------------------
  if (jcp > 0) totalIR += jcp * 0.15;

  // -------------------------
  // 4️⃣ Ganho de capital ações / FIIs com compensação de prejuízos
  // -------------------------
  if ((tipo === "acao" || tipo === "fii") && precoVenda > 0 && quantidade > 0) {
    let lucro = (precoVenda - precoCompra) * quantidade - custos;

    // compensar prejuízo anterior
    if (prejuizos > 0) {
      if (lucro >= prejuizos) {
        lucro -= prejuizos;
        prejuizos = 0;
      } else {
        prejuizos -= lucro;
        lucro = 0;
      }
    }

    if (tipo === "acao") {
      if (operacao === "swing" && lucro > 20000) totalIR += lucro * 0.15;
      else if (operacao === "day" && lucro > 0) totalIR += lucro * 0.20;
    } else if (tipo === "fii" && lucro > 0) {
      totalIR += lucro * 0.20;
    }
  }

  // -------------------------
  // 5️⃣ Juros / títulos / fundos (tabela regressiva)
  // -------------------------
  if (juros > 0 && dataCompra && dataResgate) {
    const d1 = new Date(dataCompra);
    const d2 = new Date(dataResgate);
    const diffDias = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));

    let aliquota = 0;
    if (diffDias <= 180) aliquota = 0.225;
    else if (diffDias <= 360) aliquota = 0.20;
    else if (diffDias <= 720) aliquota = 0.175;
    else aliquota = 0.15;

    totalIR += juros * aliquota;
  }

  // -------------------------
  // 6️⃣ Resultado final
  // -------------------------
  document.getElementById("resultado").innerText = "R$ " + totalIR.toFixed(2);
}