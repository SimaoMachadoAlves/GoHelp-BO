document.addEventListener('DOMContentLoaded', function () {

    const itemsPerPage = 7; // Número de itens por página
    let currentPage = 1;
    let locais = JSON.parse(localStorage.getItem("locais")) || [];

    // Função para gerar detalhes do popover
    function detalhesPopover(local) {
        let detalhes = `
            <strong>Nome:</strong> ${local.nome}<br>
            <strong>Tipo:</strong> ${local.tipo}<br>
            <strong>Morada:</strong> ${local.morada}<br>
            <strong>Capacidade:</strong> ${local.capacidade}<br>
            <strong>Descrição:</strong> ${local.descricao}
        `;
        return detalhes;
    }

    // Função para preencher a tabela
    function preencherTabela(locais, page = 1) {
        const tabelaBody = document.querySelector('#tabela-locais');
        tabelaBody.innerHTML = ''; // Limpar o conteúdo existente

        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedLocais = locais.slice(start, end);

        paginatedLocais.forEach((local, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${local.nome}</td>
                <td>${local.morada}</td>
                <td>${local.capacidade}</td>
                <td class="text-end">
                    <a tabindex="0" class="popover-dismiss" style="cursor:pointer; text-decoration:underline; color:black;" 
                        data-bs-toggle="popover" data-bs-trigger="focus" data-bs-html="true" 
                        data-bs-content="${detalhesPopover(local)}">Ver detalhes</a>
                    <i class="bi bi-x-square" style="cursor:pointer;" onclick="removerLocal(${start + index})"></i>
                </td>
            `;
            tabelaBody.appendChild(row);
        });

        // Inicializar popovers
        inicializarPopovers();
        atualizarPaginacao(locais.length, page);
    }

    // Função para inicializar popovers
    function inicializarPopovers() {
        const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
        popoverTriggerList.forEach(function (popoverTriggerEl) {
            new bootstrap.Popover(popoverTriggerEl);
        });
    }

    // Função para criar item de página
    function criarItemPagina(texto, pagina) {
        const item = document.createElement('li');
        item.className = 'page-item';
        const link = document.createElement('a');
        link.className = 'page-link';
        link.href = '#';
        link.innerHTML = texto;
        link.dataset.page = pagina;
        link.addEventListener('click', function (event) {
            event.preventDefault();
            currentPage = pagina;
            preencherTabela(locais, pagina);
        });
        item.appendChild(link);
        return item;
    }

    // Função para atualizar a paginação
    function atualizarPaginacao(totalItems, page) {
        const paginationElement = document.querySelector('.pagination');
        paginationElement.innerHTML = ''; // Limpar a paginação existente

        const totalPages = Math.ceil(totalItems / itemsPerPage);

        // Adicionar botão "Previous"
        const previousItem = criarItemPagina('&laquo;', Math.max(page - 1, 1));
        paginationElement.appendChild(previousItem);

        // Adicionar números das páginas
        for (let i = 1; i <= totalPages; i++) {
            const pageItem = criarItemPagina(i, i);
            if (i === page) {
                pageItem.classList.add('active');
            }
            paginationElement.appendChild(pageItem);
        }

        // Adicionar botão "Next"
        const nextItem = criarItemPagina('&raquo;', Math.min(page + 1, totalPages));
        paginationElement.appendChild(nextItem);
    }

    // Função para remover um local
    window.removerLocal = function (index) {
        locais.splice(index, 1); // Remove o local do array
        localStorage.setItem("locais", JSON.stringify(locais)); // Atualiza o localStorage
        preencherTabela(locais, currentPage); // Atualiza a tabela
    };

    // Função para filtrar locais
    function filtrarLocais(texto) {
        const filtro = texto.toLowerCase();
        const locaisFiltrados = locais.filter(local =>
            local.nome.toLowerCase().includes(filtro) ||
            local.morada.toLowerCase().includes(filtro) ||
            local.capacidade.toString().includes(filtro)
        );
        preencherTabela(locaisFiltrados, 1);
    }

    // Evento de pesquisa
    const campoPesquisa = document.getElementById('procurar');
    campoPesquisa.addEventListener('input', function () {
        filtrarLocais(campoPesquisa.value);
    });

    // Carregar locais do localStorage e preencher a tabela
    preencherTabela(locais, currentPage);
});
