// Função para obter a classe CSS com base no status (caso necessário no futuro)
function getStatusClass(status) {
  switch (status) {
    case 'Concluido':
      return 'badge rounded-pill bg-success-subtle text-success-emphasis'; // Classes para status concluído
    case 'a Realizar':
      return 'badge rounded-pill bg-warning-subtle text-warning-emphasis'; // Classes para status em andamento
    case 'por Realizar':
      return 'badge rounded-pill bg-danger-subtle text-danger-emphasis'; // Classes para status pendente
    default:
      return '';
  }
}

// Função para atualizar o estoque de materiais
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

// Função para atualizar o status dos eventos
function updateEventStatus(eventos) {
  const now = new Date();

  eventos.forEach(evento => {
    const dataInicial = new Date(evento.dataEvento);
    const duracaoHoras = parseFloat(evento.duracaoEvento);
    const dataFinal = new Date(dataInicial.getTime() + duracaoHoras * 60 * 60 * 1000);

    const prevStatus = evento.status;

    // Verifica se o evento já está concluído
    if (evento.status !== 'Concluido') {
      if (now >= dataFinal) {
        evento.status = 'Concluido';
      } else if (now >= dataInicial && now < dataFinal) {
        evento.status = 'a Realizar';
      } else if (now < dataInicial) {
        evento.status = 'por Realizar';
      }
    }

    // Se o status mudou para "Concluido", ou se o evento já está concluído e materiais ainda precisam ser devolvidos
    if ((prevStatus !== 'Concluido' && evento.status === 'Concluido') || (evento.status === 'Concluido' && evento.materiais.some(m => m.qtd > 0))) {
      updateMaterialStock(evento);
    }
  });

  // Atualiza o localStorage com os novos status
  localStorage.setItem('eventos', JSON.stringify(eventos));
}

// Atualiza os status dos eventos a cada 30 minutos
setInterval(() => {
  const eventos = JSON.parse(localStorage.getItem('eventos'));
  updateEventStatus(eventos);
}, 1800000);

// Chamada inicial para configurar os status corretamente ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  const eventos = JSON.parse(localStorage.getItem('eventos'));
  updateEventStatus(eventos);
});
