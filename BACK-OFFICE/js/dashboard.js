document.addEventListener('DOMContentLoaded', function() {
  // Recupera os dados do localStorage
  const colaboradores = JSON.parse(localStorage.getItem('colaboradoresORG')) || [];
  const pedidosEventos = JSON.parse(localStorage.getItem('pedidosEventos')) || [];
  const doacoesMonetarias = JSON.parse(localStorage.getItem('doacoesMonetarias')) || [];
  const eventos = JSON.parse(localStorage.getItem('eventos')) || [];

  // Calcula o total de doações monetárias
  let totalDoacoes = doacoesMonetarias.reduce((total, doacao) => {
    let montante = parseFloat(doacao.montanteDoacao.replace('€', ''));
    return total + montante;
  }, 0);

  // Calcula o total de doações de materiais
  let totalDoacoesMat = 0;
  eventos.forEach(evento => {
    evento.inscricoes.forEach(inscricao => {
      totalDoacoesMat += inscricao.doacoesLivros.length;
      totalDoacoesMat += inscricao.doacoesMateriais.length;
    });
  });

  // Atualiza os elementos do DOM
  document.getElementById('totalColaboradores').innerText = colaboradores.length;
  document.getElementById('totalDoacoesMat').innerText = totalDoacoesMat;
  document.getElementById('totalDoacoes').innerText = totalDoacoes.toFixed(2);
  document.getElementById('totalPedidosEventos').innerText = pedidosEventos.length;

  // Função para converter data no formato DD/MM/AAAA, HH:MM:SS para objeto Date
  function parseDate(dateStr) {
    const [datePart, timePart] = dateStr.split(', ');
    const [day, month, year] = datePart.split('/').map(Number);
    const [hour, minute, second] = timePart.split(':').map(Number);
    return new Date(year, month - 1, day, hour, minute, second);
  }

  // Ordenar as doações por data mais recente
  doacoesMonetarias.sort((a, b) => parseDate(b.submissaoDataDoacao) - parseDate(a.submissaoDataDoacao));

  // Selecionar o corpo da tabela
  const tableBody = document.querySelector('.table-primary tbody');

  // Função para adicionar uma linha à tabela
  function addRow(index, nome, email, data, valor) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <th scope="row">${index}</th>
      <td>${nome}</td>
      <td>${email}</td>
      <td>${data}</td>
      <td class="text-end">${valor} <div class="d-inline-block">€</div></td>
    `;
    tableBody.appendChild(row);
  }

  // Popular a tabela com os dados ordenados
  doacoesMonetarias.forEach((doacao, index) => {
    addRow(index + 1, doacao.nomeDoacao, doacao.emailDoacao, doacao.submissaoDataDoacao, doacao.montanteDoacao.replace('€', ''));
  });
});