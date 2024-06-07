document.addEventListener('DOMContentLoaded', function() {
    const locais = JSON.parse(localStorage.getItem('locais'));
    const selectElement = document.getElementById('local-evento');
    selectElement.innerHTML = '<option disabled selected value="">Local</option>'; // Limpar e adicionar opção padrão

    if (locais) {
        locais.forEach(local => {
            const option = document.createElement('option');
            option.value = local.nome;  // Usar o 'nome' como valor
            option.textContent = local.nome; // Usar o 'nome' como texto visível
            selectElement.appendChild(option);
        });
    }
});

