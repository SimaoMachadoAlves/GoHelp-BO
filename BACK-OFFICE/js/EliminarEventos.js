document.addEventListener('DOMContentLoaded', function () {
    const eliminarButton = document.getElementById('deleteEventBtn');
    eliminarButton.addEventListener('click', function () {
        if (currentEvent) {
            updateMaterialStock(currentEvent);
            eliminarEvento(currentEvent.id);
        }
    });
});

function updateMaterialStock(evento) {
    const materiais = JSON.parse(localStorage.getItem('materiais')) || {};

    evento.materiais.forEach(material => {
        if (material.qtd > 0) { // Verifica se a quantidade é maior que 0
            if (materiais[material.id - 1]) {
                materiais[material.id - 1].qtd += material.qtd;
            } else {
                materiais[material.id - 1] = { qtd: material.qtd };
            }
            material.qtd = 0; // Reseta a quantidade do material no evento
        }
    });

    localStorage.setItem('materiais', JSON.stringify(materiais));
}

function eliminarEvento(eventoId) {
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];

    const eventoIndex = eventos.findIndex(evento => evento.id === eventoId);
    if (eventoIndex !== -1) {
        // Remover o evento da lista
        eventos.splice(eventoIndex, 1);

        // Atualizar o localStorage com os eventos restantes
        localStorage.setItem('eventos', JSON.stringify(eventos));

        // Fechar o modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('eventDetailsModal'));
        modal.hide();

        // Atualizar a lista de eventos na página
        renderizarEventos();

        alert('Evento eliminado com sucesso!');
    } else {
        alert('Erro: Evento não encontrado.');
    }
}