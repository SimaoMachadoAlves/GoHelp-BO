const precosPorFuncao = {
  "Administrativo": 15,
  "Colaborador": 12,
  "Fotógrafo": 7,
  "Motorista": 8,
  "Segurança": 8,
  "Enfermeiro": 10,
  "Colaborador Externo": 5
};

function getStatusClass(status) {
  switch (status) {
    case 'Concluido':
      return 'badge rounded-pill bg-success-subtle text-success-emphasis'; // Classes para status concluído
    case 'a Realizar':
      return 'badge rounded-pill bg-warning-subtle text-warning-emphasis'; // Classes para status em andamento
    case 'por Realizar':
      return 'badge rounded-pill bg-danger-subtle text-danger-emphasis'; // Classes para status pendente
  }
}
function formatarData(data) {
  const dataObj = new Date(data);
  return dataObj.toLocaleDateString(undefined, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }) + ' ' + dataObj.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit'

  });
}



function renderizarEventos(pagina = 1, eventosPorPagina = 8) {
  const eventos = JSON.parse(localStorage.getItem('eventos')); // Ler e converter os dados do localStorage
  const container = document.getElementById('eventosContainer');
  const pagination = document.querySelector('.paginacao-tabelas');
  container.innerHTML = ''; // Limpar conteúdo existente

  if (!eventos || eventos.length === 0) {
    container.innerHTML = '<p>Nenhum evento encontrado.</p>';
    pagination.style.display = 'none'; // Esconder a navegação de paginação se não houver eventos
    return;
  } else {
    pagination.style.display = ''; // Mostrar a navegação de paginação se houver eventos
  }

  eventos.sort((a, b) => new Date(a.dataEvento) - new Date(b.dataEvento));


  const startIndex = (pagina - 1) * eventosPorPagina;
  const endIndex = startIndex + eventosPorPagina;
  const eventosPaginados = eventos.slice(startIndex, endIndex);

  eventosPaginados.forEach(evento => {
    const statusClass = getStatusClass(evento.status);
    const cardHtml = `<li class="col-md-3 mb-4">
          <div class="card">
            <img src="images/${evento.imagemEvento}" class="card-img-top" alt="...">
            <div class="card-body pt-3">
              <div class="row">
                <div class="col-xl d-flex flex-column">
                  <div class="row">
                    <h5 class="card-title text-azul-escuro">${evento.tituloEvento}</h5>
                    <p class="card-text text-azul-escuro fs-15px">${evento.descricaoEvento}</p>
                  </div>
                  <div class="mt-auto">
                    <a href="#" class="btn btn-primary detalhes-btn" data-event-id="${evento.id}">Detalhes</a>
                  </div>
                </div>
                <div class="col-xl d-flex flex-column">
                  <div class="row-12 pb-2 d-flex justify-content-center">
                    <p class="h5 card-text text-azul-escuro">Status <span class="${statusClass}">${evento.status}</span> </p>
                  </div>
                  <div class="row pb-1 pt-2">
                    <div class="col-6 pe-0">
                      <p class="card-text mb-1 fw-bold text-azul-escuro">ID:</p>
                      <p class="card-text mb-1 text-azul-escuro fs-15px">${evento.id}</p>
                    </div>
                    <div class="col-6 ps-0">
                      <p class="card-text mb-1 fw-bold text-azul-escuro">Data:</p>
                      <p class="card-text mb-1 text-azul-escuro w-100 fs-15px">${formatarData(evento.dataEvento)}</p>
                    </div>
                    <div class="row pe-0 w-100">
                      <p class="card-text mb-1 fw-bold text-azul-escuro">Local:</p>
                      <p class="card-text mb-1 text-azul-escuro fs-15px">${evento.localEvento}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </li>`;
    container.innerHTML += cardHtml; // Adicionar o cartão ao contêiner
  });


  // Adicionar event listener para os botões "Detalhes"
  document.querySelectorAll('.detalhes-btn').forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      const eventId = this.getAttribute('data-event-id');
      const evento = eventos.find(evento => evento.id == eventId);
      abrirModalDetalhes(evento);
    });
  });



  // Atualizar links de paginação
  atualizarPaginacao(eventos.length, eventosPorPagina, pagina);
}

function atualizarPaginacao(totalEventos, eventosPorPagina, paginaAtual) {
  const pagination = document.querySelector('.paginacao-tabelas ul');
  pagination.innerHTML = ''; // Limpar paginação existente
  const totalPaginas = Math.ceil(totalEventos / eventosPorPagina);

  // Adiciona o controle 'Anterior'
  const pageItemPrev = document.createElement('li');
  pageItemPrev.className = 'page-item';
  if (paginaAtual === 1) {
    pageItemPrev.classList.add('disabled');
  }
  const pageLinkPrev = document.createElement('a');
  pageLinkPrev.className = 'page-link';
  pageLinkPrev.href = '#';
  pageLinkPrev.setAttribute('aria-label', 'Previous');
  pageLinkPrev.innerHTML = '<span aria-hidden="true">&laquo;</span>';
  pageLinkPrev.onclick = function (e) {
    e.preventDefault();
    if (paginaAtual > 1) renderizarEventos(paginaAtual - 1, eventosPorPagina);
  };
  pageItemPrev.appendChild(pageLinkPrev);
  pagination.appendChild(pageItemPrev);

  // Adiciona os números das páginas
  for (let i = 1; i <= totalPaginas; i++) {
    const pageItem = document.createElement('li');
    pageItem.className = 'page-item ' + (paginaAtual === i ? 'active' : '');
    const pageLink = document.createElement('a');
    pageLink.className = 'page-link';
    pageLink.href = '#';
    pageLink.innerText = i;
    pageLink.onclick = function (e) {
      e.preventDefault();
      renderizarEventos(i, eventosPorPagina);
    };
    pageItem.appendChild(pageLink);
    pagination.appendChild(pageItem);
  }

  // Adiciona o controle 'Próximo'
  const pageItemNext = document.createElement('li');
  pageItemNext.className = 'page-item';
  if (paginaAtual === totalPaginas) {
    pageItemNext.classList.add('disabled');
  }
  const pageLinkNext = document.createElement('a');
  pageLinkNext.className = 'page-link';
  pageLinkNext.href = '#';
  pageLinkNext.setAttribute('aria-label', 'Next');
  pageLinkNext.innerHTML = '<span aria-hidden="true">&raquo;</span>';
  pageLinkNext.onclick = function (e) {
    e.preventDefault();
    if (paginaAtual < totalPaginas) renderizarEventos(paginaAtual + 1, eventosPorPagina);
  };
  pageItemNext.appendChild(pageLinkNext);
  pagination.appendChild(pageItemNext);
}



function calcularNivelRisco(custoTotal) {
  if (custoTotal <= 2000) {
      return 1; 
  } else if (custoTotal <= 4000) {
      return 2; 
  } else if (custoTotal <= 6000) {
      return 3; 
  } else if (custoTotal <= 8000) {
      return 4; 
  } else if (custoTotal <= 10000) {
      return 5; 
  } else {
      return 5; 
  }
}

function calcularDatafinal(duracao, datainicial){
  return new Date(datainicial.getTime() + duracao * 3600000);

}

function preencherListaParticipantes(participantes) {
  const modalEventParticipantsList = document.getElementById('modalEventParticipantsList');
  modalEventParticipantsList.innerHTML = ''; // Limpar lista de participantes

  if (!participantes || participantes.length === 0) {
    modalEventParticipantsList.innerHTML = '<li>Nenhum participante inscrito.</li>';
  } else {
    participantes.forEach(participante => {
      const listItem = document.createElement('li');
      listItem.innerText = participante.nome;
      modalEventParticipantsList.appendChild(listItem);
    });
  }
}


let currentEvent = null;

function abrirModalDetalhes(evento) {
  currentEvent = evento;

  const colaboradoresORG = JSON.parse(localStorage.getItem('colaboradoresORG'));
  const materiais = JSON.parse(localStorage.getItem('materiais'));

  // Verificar se todos os elementos necessários existem
  const modalEventType = document.getElementById('modalEventType');
  const modalEventStartDate = document.getElementById('modalEventStartDate');
  const modalEventEndDate = document.getElementById('modalEventEndDate');
  const modalEventEndDateLabel = document.getElementById('modalEventEndDateLabel');
  const modalEventDuration = document.getElementById('modalEventDuration');
  const modalEventDurationLabel = document.getElementById('modalEventDurationLabel');
  const modalEventLocation = document.getElementById('modalEventLocation');
  const modalEventParticipants = document.getElementById('modalEventParticipants');
  const modalEventDescription = document.getElementById('modalEventDescription');
  const modalEventStatus = document.getElementById('modalEventStatus');
  const modalEventRiskLevel = document.getElementById('modalEventRiskLevel');
  const modalEventTotalCost = document.getElementById('modalEventTotalCost');
  const modalProfissionaisSelect = document.getElementById('modalProfissionaisSelect');
  const modalMateriaisSelect = document.getElementById('modalMateriaisSelect');
  const modalProfissionaisSelecionados = document.getElementById('modalProfissionaisSelecionados');
  const modalMateriaisSelecionados = document.getElementById('modalMateriaisSelecionados');
  const modalEventParticipantsList = document.getElementById('modalEventParticipantsList');
  
  // Calcular custo total dos materiais
  const custoTotalMateriais = evento.materiais.reduce((total, item) => {
    const material = materiais.find(mat => mat.id === item.id);
    return total + (material ? material.preco * item.qtd : 0);
  }, 0);

  // Calcular custo total dos colaboradores
  const duracaoHoras = parseInt(evento.duracaoEvento);
  const custoTotalColaboradores = (evento.colaboradores || []).reduce((total, prof) => {
    const colaborador = colaboradoresORG.find(col => col.emailColaborador === prof.email);
    if (colaborador) {
      const precoPorHora = precosPorFuncao[colaborador.funcaoColaborador] || 0;
      return total + (precoPorHora * duracaoHoras);
    }
    return total;
  }, 0);

  // Calcular custo total
  const custoTotal = custoTotalMateriais + custoTotalColaboradores;

  // Calcular nível de risco
  const nivelRisco = calcularNivelRisco(custoTotal);

   // Preencher selects
  popularSelects(evento.tipo);

  // Preencher campos do modal
  document.getElementById('eventDetailsModalLabel').innerText = evento.tituloEvento || 'N/A';
  modalEventType.value = evento.tipo || '';
  modalEventStartDate.value = evento.dataEvento || '';
  modalEventEndDate.value = formatarData(calcularDatafinal(evento.duracaoEvento, new Date(evento.dataEvento))) || '';
  modalEventDuration.value = evento.duracaoEvento || '';
  modalEventLocation.value = evento.localEvento || '';
  modalEventParticipants.value = evento.inscricoes.length || '0';
  modalEventDescription.value = evento.descricaoEvento || '';
  modalEventStatus.value = evento.status || '';
  modalEventRiskLevel.value = nivelRisco || '';
  modalEventTotalCost.value = `€${custoTotal.toFixed(2)}` || '';

  console.log(evento.inscricoes.length + "tamanho");

  // Preencher contêineres de materiais e profissionais selecionados
  preencherMateriaisSelecionados(evento.materiais);
  preencherProfissionaisSelecionados(evento.colaboradores);
  preencherListaParticipantes(evento.inscricoes);

  // Inicialmente, definir todos os campos como não editáveis
  setFieldsEditable(false);

  const modal = new bootstrap.Modal(document.getElementById('eventDetailsModal'));
  modal.show();

  const editButton = document.getElementById('editEventBtn');
  let isEditing = false;

  editButton.innerText = 'Editar'; // Reset the button text
  editButton.onclick = function () {
    if (!isEditing) {
      setFieldsEditable(true);
      showSelects(true);
      modalEventEndDateLabel.style.display = 'none';
      modalEventEndDate.style.display = 'none';
      modalEventDurationLabel.style.display = 'block';
      modalEventDuration.style.display = 'block';
      editButton.innerText = 'Confirmar';
      isEditing = true;
    } else {
      saveChanges(evento.id);
      editButton.innerText = 'Editar';
      isEditing = false;
    }
  };
}

function setFieldsEditable(editable) {
  const fields = ['modalEventType', 'modalEventStartDate', 'modalEventLocation', 'modalEventDescription', 'modalEventStatus', 'modalEventDuration'];
  fields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.readOnly = !editable;
      if (fieldId === 'modalEventStartDate' || fieldId === 'modalEventDuration') {
        field.disabled = !editable; // Para o date picker e duração
      }
    }
  });
  document.getElementById('modalEventType').disabled = !editable;
  document.getElementById('modalEventLocation').disabled = !editable;
  document.getElementById('modalEventStatus').disabled = !editable;

  // Tornar os campos de quantidade editáveis
  const quantidadeInputs = document.querySelectorAll('.material-item input');
  quantidadeInputs.forEach(input => {
    input.readOnly = !editable;
  });
}

function showSelects(show) {
  const selects = ['modalProfissionaisSelect', 'modalMateriaisSelect'];
  selects.forEach(selectId => {
    const select = document.getElementById(selectId);
    if (select) {
      select.style.display = show ? 'block' : 'none';
    }
  });
}

function popularSelects(tipoSelecionado) {
  const tipoEventoSelect = document.getElementById('modalEventType');
  const localEventoSelect = document.getElementById('modalEventLocation');
  const statusEventoSelect = document.getElementById('modalEventStatus');
  const profissionaisSelect = document.getElementById('modalProfissionaisSelect');
  const materiaisSelect = document.getElementById('modalMateriaisSelect');

  // Limpar selects
  tipoEventoSelect.innerHTML = '<option disabled value="">Tipo</option>';
  localEventoSelect.innerHTML = '<option disabled selected value="">Local</option>';
  statusEventoSelect.innerHTML = '';
  profissionaisSelect.innerHTML = '<option disabled selected value="">Profissionais</option>';
  materiaisSelect.innerHTML = '<option disabled selected value="">Materiais</option>';

  const tiposEvento = ['Feira do Livro', 'Concerto', 'Teatro']; // Substitua pelos tipos de evento reais
  const locaisEvento = JSON.parse(localStorage.getItem('locais'));
  const statusEvento = ['Concluido', 'por Realizar', 'a Realizar'];

  // Popular selects de tipo de evento, local e status
  tiposEvento.forEach(tipo => {
    const option = document.createElement('option');
    option.value = tipo;
    option.innerText = tipo;
    tipoEventoSelect.appendChild(option);
  });

  tipoEventoSelect.value = tipoSelecionado || ''; // Preencher o tipo de evento selecionado

  if (locaisEvento) {
    locaisEvento.forEach(local => {
      const option = document.createElement('option');
      option.value = local.nome;  // Usar o 'nome' como valor
      option.textContent = local.nome; // Usar o 'nome' como texto visível
      localEventoSelect.appendChild(option);
    });
  }

  statusEvento.forEach(status => {
    const option = document.createElement('option');
    option.value = status;
    option.innerText = status;
    statusEventoSelect.appendChild(option);
  });

  // Popular selects de profissionais e materiais
  const colaboradoresORG = JSON.parse(localStorage.getItem('colaboradoresORG'));
  const materiais = JSON.parse(localStorage.getItem('materiais'));

  colaboradoresORG.forEach(colaborador => {
    const option = document.createElement('option');
    option.value = colaborador.emailColaborador;
    option.innerText = `${colaborador.nomeColaborador} (${colaborador.funcaoColaborador})`;
    profissionaisSelect.appendChild(option);
  });

  materiais.forEach(material => {
    const option = document.createElement('option');
    option.value = material.id;
    option.innerText = material.designacao;
    materiaisSelect.appendChild(option);
  });
}

function preencherMateriaisSelecionados(materiaisSelecionados) {
  const materiaisContainer = document.getElementById('modalMateriaisSelecionados');
  materiaisContainer.innerHTML = ''; // Limpar contêiner de materiais

  materiaisSelecionados.forEach(material => {
    const materialDiv = document.createElement('div');
    materialDiv.className = 'material-item';
    materialDiv.innerHTML = `
      <span data-material="${material.designacao}">${material.designacao}</span>
      <input type="number" min="1" value="${material.qtd}" name="quantidade-${material.designacao}" class="form-control mb-0" placeholder="Quantidade" readonly>
    `;
    materiaisContainer.appendChild(materialDiv);

    const inputQuantidade = materialDiv.querySelector('input');
    inputQuantidade.addEventListener('change', function () {
      verificarStock(material.designacao, inputQuantidade);
    });
  });
}

function preencherProfissionaisSelecionados(profissionaisSelecionados) {
  const profissionaisContainer = document.getElementById('modalProfissionaisSelecionados');
  profissionaisContainer.innerHTML = ''; // Limpar contêiner de profissionais

  const colaboradoresORG = JSON.parse(localStorage.getItem('colaboradoresORG'));

  profissionaisSelecionados.forEach(profissional => {
    const colaborador = colaboradoresORG.find(col => col.emailColaborador === profissional.email);
    if (colaborador) {
      const profissionalDiv = document.createElement('div');
      profissionalDiv.className = 'profissional-item';
      profissionalDiv.innerHTML = `
        <span data-profissional="${colaborador.nomeColaborador} (${colaborador.funcaoColaborador})">${colaborador.nomeColaborador} (${colaborador.funcaoColaborador})</span>
      `;
      profissionaisContainer.appendChild(profissionalDiv);
    }
  });
}

function saveChanges(eventoId) {
  const eventos = JSON.parse(localStorage.getItem('eventos'));
  const evento = eventos.find(evento => evento.id === eventoId);
  const colaboradoresORG = JSON.parse(localStorage.getItem('colaboradoresORG'));
  const materiais = JSON.parse(localStorage.getItem('materiais'));

  if (!evento) return;

  // Capturar os novos valores do modal
  const novoTipo = document.getElementById('modalEventType').value;
  const novaData = document.getElementById('modalEventStartDate').value;
  const novoLocal = document.getElementById('modalEventLocation').value;
  const novaDescricao = document.getElementById('modalEventDescription').value;
  const novoStatus = document.getElementById('modalEventStatus').value;
  const novaDuracao = document.getElementById('modalEventDuration').value;

  // Inicializar lista de erros
  let erros = [];

  // Verificar Local
  if (novoLocal === "") {
    erros.push("Local do evento não pode estar vazio");
    document.getElementById('modalEventLocation').style.borderColor = "red";
  }

  // Verificar Tipo de Evento
  if (novoTipo === "") {
    erros.push("Tipo do evento não pode estar vazio");
    document.getElementById('modalEventType').style.borderColor = "red";
  }

  // Verificar Data e Duração do Evento
  if (novaData === "" || novaDuracao === "") {
    erros.push("Data e duração do evento não podem estar vazios");
    document.getElementById('modalEventStartDate').style.borderColor = "red";
    document.getElementById('modalEventDuration').style.borderColor = "red";
  } else {
    const dataEvento = new Date(novaData);
    const dataFinalEvento = new Date(dataEvento.getTime() + novaDuracao * 3600000);
    const eventosExistentes = eventos.filter(ev => ev.id !== eventoId);
    
    // Verificação de tipo de evento em datas próximas
    const tresDiasMs = 3 * 24 * 60 * 60 * 1000;
    const overlapTipo = eventosExistentes.some(ev => {
      const startExistingEvent = new Date(ev.dataEvento);
      return ev.tipo === novoTipo && Math.abs(dataEvento - startExistingEvent) < tresDiasMs;
    });
    if (overlapTipo) {
      erros.push("Não pode haver eventos do mesmo tipo com menos de 3 dias de intervalo");
      document.getElementById('modalEventStartDate').style.borderColor = "red";
      document.getElementById('modalEventType').style.borderColor = "red";
    }

    // Verificação de local de evento
    const overlapLocal = eventosExistentes.some(ev => {
      const startExistingEvent = new Date(ev.dataEvento);
      const endExistingEvent = new Date(startExistingEvent.getTime() + ev.duracaoEvento * 3600000);
      return ev.localEvento === novoLocal && dataEvento < endExistingEvent && dataFinalEvento > startExistingEvent;
    });
    if (overlapLocal) {
      erros.push("Já existe um evento neste local e data");
      document.getElementById('modalEventStartDate').style.borderColor = "red";
      document.getElementById('modalEventDuration').style.borderColor = "red";
      document.getElementById('modalEventLocation').style.borderColor = "red";
    }
  }

  // Verificar Colaboradores Associados
  const colaboradoresSelecionados = Array.from(document.querySelectorAll('#modalProfissionaisSelecionados .profissional-item span')).map(span => {
    const nomeCompleto = span.dataset.profissional;
    return colaboradoresORG.find(col => col.nomeColaborador + ' (' + col.funcaoColaborador + ')' === nomeCompleto);
  });

  if (colaboradoresSelecionados.length === 0) {
    erros.push("Deve haver pelo menos um colaborador associado ao evento");
    document.getElementById('modalProfissionaisSelecionados').style.borderColor = "red";
  }

  const associadosOutroEvento = colaboradoresSelecionados.some(colaborador => {
    return eventos.some(ev => ev.id !== eventoId && ev.colaboradores.some(col => col.email === colaborador.emailColaborador) && ev.dataEvento === novaData);
  });

  if (associadosOutroEvento) {
    erros.push("Um ou mais colaboradores já estão associados a outro evento na mesma data");
    document.getElementById('modalProfissionaisSelecionados').style.borderColor = "red";
  }

  // Verificar Materiais Selecionados
  const materiaisSelecionados = Array.from(document.querySelectorAll('#modalMateriaisSelecionados .material-item')).map(item => {
    const designacao = item.querySelector('span').dataset.material;
    const qtd = parseInt(item.querySelector('input').value);
    const material = materiais.find(mat => mat.designacao === designacao);
    if (qtd > material.qtd) {
      erros.push(`A quantidade do material ${designacao} excede o stock disponível`);
      item.querySelector('input').style.borderColor = "red";
    }
    return {
      id: material.id,
      designacao: designacao,
      qtd: qtd,
      status: 'naoConfirmado'
    };
  });

  if (materiaisSelecionados.length === 0) {
    erros.push("Deve haver pelo menos um material associado ao evento");
    document.getElementById('modalMateriaisSelecionados').style.borderColor = "red";
  }

  // Se houver erros, exibir alerta e limpar campos com erro
  if (erros.length > 0) {
    alert(erros.join('\n'));
    return;
  }

  // Atualizar os valores no objeto evento
  evento.tipo = novoTipo;
  evento.dataEvento = novaData;
  evento.localEvento = novoLocal;
  evento.descricaoEvento = novaDescricao;
  evento.status = novoStatus;
  evento.duracaoEvento = novaDuracao;

  // Atualizar materiais e colaboradores
  evento.materiais.forEach(material => {
    const originalMaterial = materiais.find(mat => mat.id === material.id);
    originalMaterial.qtd += material.qtd; // Repor a quantidade original
  });

  evento.materiais = materiaisSelecionados.map(material => {
    const materialOriginal = materiais.find(mat => mat.id === material.id);
    materialOriginal.qtd -= material.qtd;
    return material;
  });

  evento.colaboradores = colaboradoresSelecionados.map(colaborador => ({
    email: colaborador.emailColaborador,
    password: colaborador.passwordColaborador
  }));
  localStorage.setItem('materiais', JSON.stringify(materiais));
  localStorage.setItem('eventos', JSON.stringify(eventos));
  alert('Evento atualizado com sucesso!');
  window.location.reload();
}






document.getElementById('eventDetailsModal').addEventListener('hidden.bs.modal', resetModal);

document.addEventListener('DOMContentLoaded', function () {
  renderizarEventos(1, 8); // Inicializa a renderização com a primeira página e 8 eventos por página

  const materiaisSelect = document.getElementById('modalMateriaisSelect');
  const materiaisSelecionadosContainer = document.getElementById('modalMateriaisSelecionados');

  materiaisSelect.addEventListener('change', function () {
    const selectedMaterial = materiaisSelect.options[materiaisSelect.selectedIndex].text;
    const existingMaterialDiv = document.querySelector(`.material-item span[data-material="${selectedMaterial}"]`);

    if (existingMaterialDiv) {
      existingMaterialDiv.parentElement.remove(); // Remove o div existente
    } else {
      const materialDiv = document.createElement('div');
      materialDiv.className = 'material-item';
      materialDiv.innerHTML = `
        <span data-material="${selectedMaterial}">${selectedMaterial}</span>
        <input type="number" min="1" name="quantidade-${selectedMaterial}" class="form-control mb-0" placeholder="Quantidade" required>
      `;
      materiaisSelecionadosContainer.appendChild(materialDiv);

      const inputQuantidade = materialDiv.querySelector('input');
      inputQuantidade.addEventListener('change', function () {
        verificarStock(selectedMaterial, inputQuantidade);
      });
    }

    materiaisSelect.value = ''; // Limpa o campo de seleção
  });

  const profissionaisSelect = document.getElementById('modalProfissionaisSelect');
  const profissionaisSelecionadosContainer = document.getElementById('modalProfissionaisSelecionados');

  profissionaisSelect.addEventListener('change', function () {
    const selectedProfissional = profissionaisSelect.options[profissionaisSelect.selectedIndex].text;
    const existingProfissionalDiv = document.querySelector(`.profissional-item span[data-profissional="${selectedProfissional}"]`);
    const colaboradoresORG = JSON.parse(localStorage.getItem('colaboradoresORG')) || [];
    const dataEventoInput = document.getElementById('modalEventStartDate').value;
    const localEventoSelect = document.getElementById('modalEventLocation');
    const localEvento = localEventoSelect.options[localEventoSelect.selectedIndex].text;

    const colaborador = colaboradoresORG.find(col => col.nomeColaborador + ' (' + col.funcaoColaborador + ')' === selectedProfissional);

    if (existingProfissionalDiv) {
      existingProfissionalDiv.parentElement.remove(); // Remove o div existente
    } else {
      const profissionalDiv = document.createElement('div');
      profissionalDiv.className = 'profissional-item';
      profissionalDiv.innerHTML = `
        <span data-profissional="${selectedProfissional}">${selectedProfissional}</span>
      `;
      profissionaisSelecionadosContainer.appendChild(profissionalDiv);
    }

    profissionaisSelect.value = ''; // Limpa o campo de seleção
  });
});

function verificarStock(materialNome, inputStock) {
  const materiaisTabela = JSON.parse(localStorage.getItem('materiais')) || [];

  const material = materiaisTabela.find(m => m.designacao === materialNome);
  if (material && inputStock.value > material.qtd) {
    alert(`Quantidade solicitada de ${materialNome} excede o stock disponível (${material.qtd})`);
    inputStock.style.borderColor = 'red';
  } else {
    inputStock.style.borderColor = '';
  }
}

function resetModal() {
  currentEvent = null;
  setFieldsEditable(false);
  showSelects(false);
  document.getElementById('editEventBtn').innerText = 'Editar';
  document.getElementById('modalEventEndDateLabel').style.display = 'block';
  document.getElementById('modalEventEndDate').style.display = 'block';
  document.getElementById('modalEventDurationLabel').style.display = 'none';
  document.getElementById('modalEventDuration').style.display = 'none';
}

document.getElementById('eventDetailsModal').addEventListener('hidden.bs.modal', resetModal);


function verificarStock(materialNome, inputStock) {
  const materiaisTabela = JSON.parse(localStorage.getItem('materiais')) || [];

  materiaisTabela.forEach(material => {
    if (material.designacao === materialNome) {
      const quantidadeInserida = parseInt(inputStock.value);
      if (quantidadeInserida > material.qtd) {
        alert('A quantidade inserida excede o stock disponível!');
        inputStock.value = material.qtd;
      }
    }
  });
}

document.getElementById('procurar').addEventListener('input', function() {
  const query = this.value.toLowerCase();
  procurarEventos(query);
});

document.getElementById('procurar').addEventListener('input', function() {
  const query = this.value.toLowerCase();
  procurarEventos(query);
});
function procurarEventos(query) {
  const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
  const eventosFiltrados = eventos.filter(evento => 
    evento.tituloEvento.toLowerCase().includes(query)
  );
  eventosFiltrados.sort((a, b) => new Date(a.dataEvento) - new Date(b.dataEvento)); // Ordenar eventos por data
  renderizarEventosFiltrados(eventosFiltrados);
}

function renderizarEventosFiltrados(eventosFiltrados) {
  const container = document.getElementById('eventosContainer');
  const pagination = document.querySelector('.paginacao-tabelas');
  container.innerHTML = ''; // Limpar conteúdo existente

  if (!eventosFiltrados || eventosFiltrados.length === 0) {
    container.innerHTML = '<p>Nenhum evento encontrado.</p>';
    pagination.style.display = 'none'; // Esconder a navegação de paginação se não houver eventos
    return;
  } else {
    pagination.style.display = ''; // Mostrar a navegação de paginação se houver eventos
  }

  eventosFiltrados.forEach(evento => {
    const statusClass = getStatusClass(evento.status);
    const cardHtml = `<li class="col-md-3 mb-4">
          <div class="card">
            <img src="images/${evento.imagemEvento}" class="card-img-top" alt="...">
            <div class="card-body pt-3">
              <div class="row">
                <div class="col-xl d-flex flex-column">
                  <div class="row">
                    <h5 class="card-title text-azul-escuro">${evento.tituloEvento}</h5>
                    <p class="card-text text-azul-escuro fs-15px">${evento.descricaoEvento}</p>
                  </div>
                  <div class="mt-auto">
                    <a href="#" class="btn btn-primary detalhes-btn" data-event-id="${evento.id}">Detalhes</a>
                  </div>
                </div>
                <div class="col-xl d-flex flex-column">
                  <div class="row-12 pb-2 d-flex justify-content-center">
                    <p class="h5 card-text text-azul-escuro">Status <span class="${statusClass}">${evento.status}</span> </p>
                  </div>
                  <div class="row pb-1 pt-2">
                    <div class="col-6 pe-0">
                      <p class="card-text mb-1 fw-bold text-azul-escuro">ID:</p>
                      <p class="card-text mb-1 text-azul-escuro fs-15px">${evento.id}</p>
                    </div>
                    <div class="col-6 ps-0">
                      <p class="card-text mb-1 fw-bold text-azul-escuro">Data:</p>
                      <p class="card-text mb-1 text-azul-escuro w-100 fs-15px">${formatarData(evento.dataEvento)}</p>
                    </div>
                    <div class="row pe-0 w-100">
                      <p class="card-text mb-1 fw-bold text-azul-escuro">Local:</p>
                      <p class="card-text mb-1 text-azul-escuro fs-15px">${evento.localEvento}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </li>`;
    container.innerHTML += cardHtml; // Adicionar o cartão ao contêiner
  });

  // Adicionar event listener para os botões "Detalhes"
  document.querySelectorAll('.detalhes-btn').forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      const eventId = this.getAttribute('data-event-id');
      const evento = eventosFiltrados.find(evento => evento.id == eventId);
      abrirModalDetalhes(evento);
    });
  });
}














