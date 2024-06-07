document.addEventListener('DOMContentLoaded', function () {
    const itemsPerPage = 7; // Número de itens por página
    let currentPage = 1;
    let doacoes = JSON.parse(localStorage.getItem("doacoesMonetarias")) || [];

    // Função para calcular o total doado por cada usuário
    function calcularTotalDoado(doacoes) {
        const totalPorUsuario = {};

        doacoes.forEach(doacao => {
            if (!totalPorUsuario[doacao.emailDoacao]) {
                totalPorUsuario[doacao.emailDoacao] = 0;
            }
            totalPorUsuario[doacao.emailDoacao] += parseFloat(doacao.montanteDoacao.replace('€', ''));
        });

        return totalPorUsuario;
    }

    // Função para preencher a tabela
    function preencherTabela(doacoes, page = 1) {
        const tabelaBody = document.querySelector('#tabela-doacoes-monetarias');
        tabelaBody.innerHTML = ''; // Limpar o conteúdo existente

        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedDoacoes = doacoes.slice(start, end);
        const totalPorUsuario = calcularTotalDoado(doacoes);

        paginatedDoacoes.forEach((doacao, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${doacao.id}</td>
                <td>${doacao.nomeDoacao}</td>
                <td>${doacao.emailDoacao}</td>
                <td>${doacao.submissaoDataDoacao}</td>
                <td class="text-end">
                    <a tabindex="0" class="popover-dismiss" style="cursor:pointer; text-decoration:underline; color:black;" 
                        data-bs-toggle="popover" data-bs-trigger="focus" data-bs-html="true" 
                        data-bs-content="O utilizador já deu: ${totalPorUsuario[doacao.emailDoacao]}€">${doacao.montanteDoacao}</a>
                </td>
            `;
            tabelaBody.appendChild(row);
        });

        // Inicializar popovers
        inicializarPopovers();
        atualizarPaginacao(doacoes.length, page);
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
            preencherTabela(doacoes, pagina);
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

    // Função para filtrar doações
    function filtrarDoacoes(texto) {
        const filtro = texto.toLowerCase();
        const doacoesFiltradas = doacoes.filter(doacao =>
            doacao.nomeDoacao.toLowerCase().includes(filtro) ||
            doacao.emailDoacao.toLowerCase().includes(filtro) ||
            doacao.montanteDoacao.toLowerCase().includes(filtro) ||
            doacao.submissaoDataDoacao.includes(filtro)
        );
        preencherTabela(doacoesFiltradas, 1);
    }

    // Evento de pesquisa
    const campoPesquisa = document.getElementById('procurar');
    campoPesquisa.addEventListener('input', function () {
        filtrarDoacoes(campoPesquisa.value);
    });

    // Carregar doações do localStorage e preencher a tabela
    preencherTabela(doacoes, currentPage);
});
