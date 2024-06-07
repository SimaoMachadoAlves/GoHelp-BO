// CartaoCarteira.js

document.addEventListener('DOMContentLoaded', function () {
    const doacoes = JSON.parse(localStorage.getItem("doacoesMonetarias")) || [];

    // Função para calcular o total do montante doado e o número de doações
    function calcularEstatisticasDoacoes(doacoes) {
        let totalMontante = 0;
        let numeroDoacoes = doacoes.length;

        doacoes.forEach(doacao => {
            totalMontante += parseFloat(doacao.montanteDoacao.replace('€', ''));
        });

        return {
            totalMontante: totalMontante.toFixed(2), // Formatar o total para duas casas decimais
            numeroDoacoes: numeroDoacoes
        };
    }

    // Função para atualizar o cartão da carteira GoHelp
    function atualizarCartaoCarteira(estatisticas) {
        const cardBody = document.querySelector('.card-carteira .card-body');
        cardBody.innerHTML = `
            Total de Dinheiro Doado: ${estatisticas.totalMontante}€<br>
            Número Total de Doações: ${estatisticas.numeroDoacoes}
        `;
    }

    // Calcular as estatísticas e atualizar o cartão
    const estatisticasDoacoes = calcularEstatisticasDoacoes(doacoes);
    atualizarCartaoCarteira(estatisticasDoacoes);
});
