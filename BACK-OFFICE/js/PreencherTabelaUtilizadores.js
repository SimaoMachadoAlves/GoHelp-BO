const tabelaUtilizadores = document.getElementById("tabela-utilizadores");
const paginationContainer = document.querySelector('.paginacao-tabelas .pagination');

// Recupera a lista de utilizadores do FO armazenada no localStorage.
const utilizadores = JSON.parse(localStorage.getItem("utilizadoresFrontOffice")) || [];

// Variáveis de paginação
const rowsPerPage = 7;
let currentPage = 1;

document.addEventListener("DOMContentLoaded", function () {
  console.log(utilizadores);
  displayUsers(currentPage);
  setupPagination(utilizadores, paginationContainer, rowsPerPage);
});

function displayUsers(page) {
  tabelaUtilizadores.innerHTML = '';
  const start = (page - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedUsers = utilizadores.slice(start, end);

  paginatedUsers.forEach((utilizador, index) => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${start + index + 1}</td>
      <td>${utilizador.email}</td>
      <td>${utilizador.name}</td>
      <td class="text-end">
        <i class="bi bi-x-square" style="cursor:pointer;" onclick="removerUtilizador(${start + index})"></i>
      </td>
    `;
    tabelaUtilizadores.appendChild(linha);
  });
}

function setupPagination(items, wrapper, rowsPerPage) {
  wrapper.innerHTML = '';
  const pageCount = Math.ceil(items.length / rowsPerPage);

  // Botão "Previous"
  const prevButton = document.createElement('li');
  prevButton.classList.add('page-item');
  prevButton.innerHTML = `<a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>`;
  prevButton.addEventListener('click', function () {
    if (currentPage > 1) {
      currentPage--;
      displayUsers(currentPage);
      updatePagination();
    }
  });
  wrapper.appendChild(prevButton);

  // Botões de página
  for (let i = 1; i <= pageCount; i++) {
    const btn = paginationButton(i);
    wrapper.appendChild(btn);
  }

  // Botão "Next"
  const nextButton = document.createElement('li');
  nextButton.classList.add('page-item');
  nextButton.innerHTML = `<a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a>`;
  nextButton.addEventListener('click', function () {
    if (currentPage < pageCount) {
      currentPage++;
      displayUsers(currentPage);
      updatePagination();
    }
  });
  wrapper.appendChild(nextButton);
}

function paginationButton(page) {
  const button = document.createElement('li');
  button.classList.add('page-item');
  button.innerHTML = `<a class="page-link" href="#">${page}</a>`;
  
  if (page === currentPage) button.classList.add('active');
  
  button.addEventListener('click', function () {
    currentPage = page;
    displayUsers(currentPage);
    updatePagination();
  });
  
  return button;
}

function updatePagination() {
  const pageItems = paginationContainer.querySelectorAll('.page-item');
  pageItems.forEach((item, index) => {
    if (index === currentPage) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

function removerUtilizador(index) {
  const confirmation = window.confirm("Tem certeza que deseja excluir este utilizador?");
  if (confirmation) {
    utilizadores.splice(index, 1);
    localStorage.setItem("utilizadoresFrontOffice", JSON.stringify(utilizadores));
    displayUsers(currentPage);
    setupPagination(utilizadores, paginationContainer, rowsPerPage);
  }
}

// Pesquisar na Tabela por Nome de Utilizador
document.getElementById("procurar").addEventListener("input", function () {
  const filtro = this.value.toUpperCase();
  const linhas = tabelaUtilizadores.getElementsByTagName("tr");

  for (let i = 0; i < linhas.length; i++) {
    const celulaNome = linhas[i].getElementsByTagName("td")[2]; // [2] para filtrar por nome

    if (celulaNome) {
      const nome = celulaNome.textContent || celulaNome.innerText;
      linhas[i].style.display =
        nome.toUpperCase().indexOf(filtro) > -1
          ? ""
          : "none";
    }
  }
});
