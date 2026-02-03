// Limpa todos os inputs quando a página carregar
window.onload = () => {
  document.querySelectorAll("input").forEach(i => i.value = "");
  document.getElementById('resultado-calculo').innerHTML = "";
};

function calcularJuros(){
  const capital = parseFloat(document.getElementById('capital').value) || 0;
  const aporte  = parseFloat(document.getElementById('aporte').value) || 0;
  const taxa    = (parseFloat(document.getElementById('taxa').value) || 0) / 100;
  let tempo     = parseInt(document.getElementById('tempo').value) || 0;
  const tipo    = document.getElementById('tipo').value;

  // Se for em anos, converte para meses
  if(tipo === 'ano') tempo *= 12;

  let montante = capital;
  let totalAportes = capital;
  let historico = '';

  for(let i = 1; i <= tempo; i++){
    montante = montante * (1 + taxa) + aporte;
    totalAportes += aporte;

    historico += `
      <p>
        <strong>Mês ${i}</strong> —
        Com reinvestimento: R$ ${montante.toFixed(2)} |
        Juros acumulados: R$ ${(montante - totalAportes).toFixed(2)}
      </p>
    `;
  }

  document.getElementById('resultado-calculo').innerHTML = `
    <h2>Total final: R$ ${montante.toFixed(2)}</h2>
    <p>Total investido: R$ ${totalAportes.toFixed(2)}</p>
    <p>Total em juros: R$ ${(montante - totalAportes).toFixed(2)}</p>
    <hr>
    ${historico}
  `;
}