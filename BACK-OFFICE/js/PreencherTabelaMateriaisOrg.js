document.addEventListener('DOMContentLoaded', function () {
    const itemsPerPage = 7; // Número de itens por página
    let currentPage = 1;
    let materiais = JSON.parse(localStorage.getItem("materiais")) || [];

    function detalhesPopover(material) {
        return `
            <strong>Designação:</strong> ${material.designacao}<br>
            <strong>Categoria:</strong> ${material.categoria}<br>
            <strong>Descrição:</strong> ${material.descricao}<br>
            <strong>Quantidade:</strong> ${material.qtd}<br>
        `;
    }

    function preencherTabela(filteredMateriais, page = 1) {
        const tabelaBody = document.querySelector('#tabela-materiais');
        tabelaBody.innerHTML = '';

        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedItems = filteredMateriais.slice(start, end);

        paginatedItems.forEach((material, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${start + index + 1}</td>
                <td>${material.designacao}</td>
                <td>${material.categoria}</td>
                <td>${material.qtd}</td>
                <td class="text-end">
                    <a tabindex="0" class="popover-dismiss" style="cursor:pointer; text-decoration:underline; color:black;"
                        data-bs-toggle="popover" data-bs-trigger="focus" data-bs-html="true"
                        data-bs-content="${detalhesPopover(material)}">Ver detalhes</a>
                    <i class="bi bi-x-square" style="cursor:pointer;" onclick="removerLocal(${start + index})"></i>
                </td>
            `;
            tabelaBody.appendChild(row);
        });

        inicializarPopovers();
        atualizarPaginacao(filteredMateriais.length, page);
    }

    function inicializarPopovers() {
        const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
        popoverTriggerList.forEach(function (popoverTriggerEl) {
            new bootstrap.Popover(popoverTriggerEl);
        });
    }

    function atualizarPaginacao(totalItems, page) {
        const paginationElement = document.querySelector('.pagination');
        paginationElement.innerHTML = '';

        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const previousItem = criarItemPagina('&laquo;', Math.max(page - 1, 1));
        paginationElement.appendChild(previousItem);

        for (let i = 1; i <= totalPages; i++) {
            const pageItem = criarItemPagina(i, i);
            if (i === page) {
                pageItem.classList.add('active');
            }
            paginationElement.appendChild(pageItem);
        }

        const nextItem = criarItemPagina('&raquo;', Math.min(page + 1, totalPages));
        paginationElement.appendChild(nextItem);
    }

    window.removerLocal = function (index) {
        materiais.splice(index, 1); // Remove o local do array
        localStorage.setItem("materiais", JSON.stringify(materiais)); // Atualiza o localStorage
        preencherTabela(materiais, currentPage); // Atualiza a tabela
    };


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
            preencherTabela(materiais, pagina);
        });
        item.appendChild(link);
        return item;
    }

    document.getElementById("procurar").addEventListener("input", function () {
        const filtro = this.value.toLowerCase();
        const filteredMateriais = materiais.filter(material =>
            material.designacao.toLowerCase().includes(filtro) ||
            material.categoria.toLowerCase().includes(filtro) ||
            material.qtd.toString().toLowerCase().includes(filtro)
        );
        preencherTabela(filteredMateriais, 1);
    });

    preencherTabela(materiais, currentPage);
});