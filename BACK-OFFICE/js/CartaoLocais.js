
document.addEventListener('DOMContentLoaded', function () {
    atualizarCartaoLocais();

    function atualizarCartaoLocais() {
        const locais = JSON.parse(localStorage.getItem('locais')) || [];

        // Ordenar locais pela capacidade em ordem decrescente
        const sortedLocais = locais.sort((a, b) => b.capacidade - a.capacidade);

        // Selecionar os três locais de maior capacidade
        const topLocais = sortedLocais.slice(0, 3);

        // Gerar o conteúdo do cartão
        const cartaoConteudo = `
            <h5 class="card-title"></h5>
            <ul class="list-group.locais list-group-flush">
                ${topLocais.map(local => `
                    <li class="list-group-item-locais">
                        <strong>${local.nome}</strong> - ${local.capacidade} pessoas
                    </li>`).join('')}
            </ul>
        `;

        // Atualiza o conteúdo do cartão
        document.querySelector('.card-locais .card-body').innerHTML = cartaoConteudo;
    }
});
