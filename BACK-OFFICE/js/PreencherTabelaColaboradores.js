document.addEventListener('DOMContentLoaded', function () {
  const tabelaColaboradores = document.getElementById('tabela-colaboradores');
  let colaboradores = JSON.parse(localStorage.getItem('colaboradoresORG')) || [];
  let colaboradoresFiltrados = colaboradores;
  let paginaAtual = 1;
  const linhasPorPagina = 7;

  function adicionarLinhaTabela(colaborador) {
    const linha = document.createElement('tr');
    linha.innerHTML = `
      <td>${colaborador.iddColaborador}</td>
      <td>
        <a tabindex="0" class="popover-dismiss" style="cursor:pointer; text-decoration:underline; color: black;" 
           data-bs-toggle="popover" data-bs-trigger="focus" data-bs-html="true" 
           data-bs-content="${detalhesPopover(colaborador)}">${colaborador.nomeColaborador}</a>
      </td>
      <td>${colaborador.contactoColaborador}</td>
      <td>${colaborador.dataCriacao}</td>
      <td><span class="badge ${colaborador.tipoColaborador === 'Interno' ? 'badge-verde' : 'badge-amarelo'}">${colaborador.funcaoColaborador}</span></td>
      <td class="text-end">
        <i class="bi bi-x-square" style="cursor:pointer;" onclick="removerColaborador(${colaboradores.indexOf(colaborador)})"></i>
      </td>
    `;
    tabelaColaboradores.appendChild(linha);
  }

  function detalhesPopover(colaborador) {
    let detalhes = `
      <strong>ID:</strong> ${colaborador.iddColaborador}<br>
      <strong>Nome:</strong> ${colaborador.nomeColaborador}<br>
      <strong>Contato:</strong> ${colaborador.contactoColaborador}<br>
      <strong>Email:</strong> ${colaborador.emailColaborador}<br>
      <strong>Descrição:</strong> ${colaborador.descricaoColaborador}<br>
      <strong>Data de Criação:</strong> ${colaborador.dataCriacao}<br>
      <strong>Função:</strong> ${colaborador.funcaoColaborador}<br>
      <strong>Tipo:</strong> ${colaborador.tipoColaborador}
    `;
    if (colaborador.tipoColaborador === 'Interno') {
      detalhes += `<br><strong>Password:</strong> ${colaborador.passwordColaborador}`;
    }
    return detalhes;
  }

  function removerColaborador(index) {
    if (confirm('Tem certeza que deseja remover este colaborador?')) {
      colaboradores.splice(index, 1);
      localStorage.setItem('colaboradoresORG', JSON.stringify(colaboradores));
      window.location.reload();
    }
  }


  function filtrarTabela(tipo) {
    tabelaColaboradores.innerHTML = '';
    colaboradoresFiltrados = tipo === 'Todos' ? colaboradores : colaboradores.filter(col => col.tipoColaborador === tipo);
    criarPaginacao();
    mostrarPagina(paginaAtual);
  }

  function mostrarPagina(numero) {
    tabelaColaboradores.innerHTML = '';
    const inicio = (numero - 1) * linhasPorPagina;
    const fim = inicio + linhasPorPagina;
    colaboradoresFiltrados.slice(inicio, fim).forEach(adicionarLinhaTabela);
    inicializarPopovers();
  }

  function criarPaginacao() {
    const paginacao = document.querySelector('.pagination');
    paginacao.innerHTML = '';
    const totalPaginas = Math.ceil(colaboradoresFiltrados.length / linhasPorPagina);
    paginacao.appendChild(criarItemPagina('&laquo;', 'prev'));
    for (let i = 1; i <= totalPaginas; i++) {
      paginacao.appendChild(criarItemPagina(i.toString(), i));
    }
    paginacao.appendChild(criarItemPagina('&raquo;', 'next'));
  }

  function criarItemPagina(texto, pagina) {
    const item = document.createElement('li');
    item.className = 'page-item';
    const link = document.createElement('a');
    link.className = 'page-link';
    link.href = '#';
    link.innerHTML = texto;
    link.dataset.page = pagina;
    item.appendChild(link);
    return item;
  }

  function inicializarPopovers() {
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.forEach(function (popoverTriggerEl) {
      new bootstrap.Popover(popoverTriggerEl);
    });
  }

  function setupEventListeners() {
    document.querySelector('.btn-cinza').addEventListener('click', () => filtrarTabela('Todos'));
    document.querySelector('.btn-secondary').addEventListener('click', () => filtrarTabela('Externo'));
    document.querySelector('.btn-primary').addEventListener('click', () => filtrarTabela('Interno'));

    document.querySelector('.pagination').addEventListener('click', function (event) {
      const target = event.target;
      if (target.tagName === 'A') {
        const novaPagina = target.dataset.page;
        if (novaPagina === 'prev') {
          paginaAtual = Math.max(1, paginaAtual - 1);
        } else if (novaPagina === 'next') {
          const totalPaginas = Math.ceil(colaboradoresFiltrados.length / linhasPorPagina);
          paginaAtual = Math.min(totalPaginas, paginaAtual + 1);
        } else {
          paginaAtual = parseInt(novaPagina);
        }
        mostrarPagina(paginaAtual);
        event.preventDefault();
      }
    });

    document.getElementById('procurar').addEventListener('input', function () {
      const filtro = this.value.toUpperCase();
      const linhas = tabelaColaboradores.getElementsByTagName('tr');
      for (let i = 0; i < linhas.length; i++) {
        const celulaNome = linhas[i].getElementsByTagName('td')[1];
        if (celulaNome) {
          const nome = celulaNome.textContent || celulaNome.innerText;
          linhas[i].style.display = nome.toUpperCase().indexOf(filtro) > -1 ? "" : "none";
        }
      }
    });
  }

  setupEventListeners();
  filtrarTabela('Todos');
  
  window.removerColaborador = removerColaborador;
});
