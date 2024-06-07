document.addEventListener("DOMContentLoaded", function() {
    preencherTabelaPedidosEventos(1);
    adicionarEventosModal();
    popularSelects();
});

const ITEMS_PER_PAGE = 10; // Defina o número de itens por página

function formatarData(data) {
    const dataObj = new Date(data);
    return dataObj.toLocaleDateString(undefined, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }) + ', ' + dataObj.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function mudarBadge(badge) {
    if (badge == "<div class='badge bg-warning'>Pendente</div>")
        return "<div class='badge badge-amarelo'>Pendente</div>";
    return badge;
}

function preencherTabelaPedidosEventos(page) {
    const pedidos = JSON.parse(localStorage.getItem("pedidosEventos"));

    if (!pedidos) {
        console.log("Nenhum pedido de trabalho encontrado no localStorage.");
        return;
    }

    pedidos.sort((a, b) => {
        const dataA = Date.parse(a.submissaoDataPedidoEvento.replace(/(\d{2})\/(\d{2})\/(\d{4}), (\d{2}:\d{2}:\d{2})/, '$3-$2-$1T$4'));
        const dataB = Date.parse(b.submissaoDataPedidoEvento.replace(/(\d{2})\/(\d{2})\/(\d{4}), (\d{2}:\d{2}:\d{2})/, '$3-$2-$1T$4'));
        return dataB - dataA;
    });

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const pedidosPaginados = pedidos.slice(startIndex, endIndex);

    const tabelaBody = document.getElementById("conteudo-tabela-aceitar-eventos");
    tabelaBody.innerHTML = "";

    pedidosPaginados.forEach((pedido) => {
        const linha = `<tr>
            <td>${pedido.submissaoDataPedidoEvento}</td>
            <td>${pedido.tituloPedidoEvento}</td>
            <td>${pedido.tipoPedidoEvento}</td>
            <td>${formatarData(pedido.dataPretendidaPedidoEvento)}</td>
            <td>${mudarBadge(pedido.estadoPedidoEvento)}</td>
            <td><a href="#" data-toggle="modal" data-id="${pedido.id}" class="link-ver-detalhes text-azul-escuro">Ver Detalhes</a></td>
        </tr>`;
        tabelaBody.innerHTML += linha;
    });

    tabelaBody.addEventListener('click', function(event) {
        let target = event.target;
        while (target != tabelaBody && !target.classList.contains('link-ver-detalhes')) {
            target = target.parentNode;
        }
        if (target.classList.contains('link-ver-detalhes')) {
            const pedidoId = target.getAttribute('data-id');
            document.querySelectorAll('.link-ver-detalhes').forEach(link => link.classList.remove('active'));
            target.classList.add('active');
            preencherDetalhesModal(pedidoId);

            var detalhesModal = bootstrap.Modal.getInstance(document.getElementById('detalhes-Eventos'));
            if (detalhesModal) {
                detalhesModal.hide();
                detalhesModal.dispose(); // Garantir que a instância anterior é descartada
            }
            detalhesModal = new bootstrap.Modal(document.getElementById('detalhes-Eventos'));
            detalhesModal.show();
        }
    });

    renderPagination(pedidos.length, page);
}

function renderPagination(totalItems, currentPage) {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const paginationElement = document.querySelector('.pagination');
    paginationElement.innerHTML = '';

    const createPageItem = (page, label, isDisabled = false, isActive = false) => {
        const li = document.createElement('li');
        li.className = `page-item ${isDisabled ? 'disabled' : ''} ${isActive ? 'active' : ''}`;
        const a = document.createElement('a');
        a.className = 'page-link';
        a.href = '#';
        a.textContent = label;
        a.setAttribute('data-page', page);
        li.appendChild(a);
        return li;
    };

    paginationElement.appendChild(createPageItem(currentPage - 1, '«', currentPage === 1));

    for (let i = 1; i <= totalPages; i++) {
        paginationElement.appendChild(createPageItem(i, i, false, i === currentPage));
    }

    paginationElement.appendChild(createPageItem(currentPage + 1, '»', currentPage === totalPages));

    paginationElement.querySelectorAll('.page-link').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const page = parseInt(event.target.getAttribute('data-page'));
            preencherTabelaPedidosEventos(page);
        });
    });
}

function preencherDetalhesModal(id) {
    const pedidos = JSON.parse(localStorage.getItem("pedidosEventos"));
    const pedido = pedidos.find(pedido => pedido.id === id);

    if (!pedido) {
        console.log("Pedido não encontrado.");
        return;
    }
    document.getElementById("nome-envio-evento-info").textContent = pedido.nomePedidoEvento;
    document.getElementById("email-envio-evento-info").textContent = pedido.emailPedidoEvento;
    document.getElementById("data-envio-evento-info").textContent = pedido.submissaoDataPedidoEvento;
    document.getElementById("titulo-pedido-evento-info").textContent = pedido.tituloPedidoEvento;
    document.getElementById("data-pedido-evento-info").textContent = formatarData(pedido.dataPretendidaPedidoEvento);
    document.getElementById("duracao-pedido-evento-info").textContent = pedido.duracaoPedidoEvento;
    document.getElementById("tipo-pedido-evento-info").textContent = pedido.tipoPedidoEvento;
    document.getElementById("local-pedido-evento-info").textContent = pedido.localPedidoEvento;
    document.getElementById("participantes-pedido-evento-info").textContent = pedido.participantesPedidoEvento;
    document.getElementById("descricao-pedido-evento-info").textContent = pedido.descricaoPedidoEvento;
    document.getElementById("estado-pedido-evento-info").innerHTML = mudarBadge(pedido.estadoPedidoEvento);
    document.getElementById("colaborador-pedido-evento-info").textContent = pedido.colaboradorDoEvento;
    document.getElementById("imagem-organizar-evento").src = 'images/' + pedido.imagemOrganizarEvento;
}

function adicionarEventosModal() {
    const botaoAceitar = document.getElementById('botaoAceitarPedidoEvento');
    const botaoRecusar = document.getElementById('botaoRecusarPedidoEvento');
    const enviarRespostaPedidoBotao = document.getElementById('enviarRespostaPedidoBotao');

    let estadoTemporario;  // Variável para armazenar o estado temporariamente
    let isAceitarClickedOnce = false;  // Variável para verificar se o botão foi clicado uma vez

    botaoAceitar.addEventListener('click', function() {
        if (!isAceitarClickedOnce) {
            // Primeiro clique - exibir os campos de materiais e colaboradores
            document.getElementById("modalProfissionaisSelect").style.display = "block";
            document.getElementById("modalProfissionaisSelecionados").style.display = "block";
            document.getElementById("modalMateriaisSelect").style.display = "block";
            document.getElementById("modalMateriaisSelecionados").style.display = "block";
            isAceitarClickedOnce = true;
        } else {
            // Segundo clique - processar a aceitação do evento
            estadoTemporario = 'Aceite';
            fecharDetalhesModalAbrirRespostaModal();
        }
    });

    botaoRecusar.addEventListener('click', function() {
        estadoTemporario = 'Recusado';
        fecharDetalhesModalAbrirRespostaModal();
    });

    enviarRespostaPedidoBotao.addEventListener('click', function() {
        const mensagemResposta = document.getElementById('responder-pedido-message').value;  // Captura a mensagem de resposta
        const pedidoId = document.querySelector('.link-ver-detalhes.active').getAttribute('data-id');
        atualizarEstadoPedido(estadoTemporario, pedidoId);  // Atualizar o estado do pedido
        adicionarNotificacao(pedidoId, estadoTemporario, mensagemResposta);  // Adicionar a notificação

        if (estadoTemporario === 'Aceite') {
            adicionarEvento(pedidoId);  // Adicionar o evento ao localStorage
        }

        fecharModais();
    });
}

function atualizarEstadoPedido(novoEstado, pedidoId) {
    const pedidos = JSON.parse(localStorage.getItem("pedidosEventos"));
    const pedidoIndex = pedidos.findIndex(pedido => pedido.id === pedidoId);

    if (pedidoIndex !== -1) {
        const estadoBadge = novoEstado === 'Aceite' ? 'bg-success' : 'bg-danger';
        pedidos[pedidoIndex].estadoPedidoEvento = `<div class='badge ${estadoBadge}'>${novoEstado}</div>`;
        localStorage.setItem('pedidosEventos', JSON.stringify(pedidos));
        document.getElementById('estado-pedido-evento-info').innerHTML = pedidos[pedidoIndex].estadoPedidoEvento;
        // Atualiza a tabela após a alteração do estado
        const currentPage = parseInt(document.querySelector('.pagination .active .page-link').getAttribute('data-page'));
        preencherTabelaPedidosEventos(currentPage);
    }
}

function adicionarNotificacao(pedidoId, novoEstado, mensagemResposta) {
    let notificacoes = JSON.parse(localStorage.getItem('notificacoes'));
    if (!notificacoes) {
        notificacoes = {
            notificacoesPedidosEventos: [],
            notificacoesPedidosTrabalho: [] // Garante que este campo também esteja presente
        };
    } else {
        // Garante que o array para notificações de pedidos de eventos exista
        notificacoes.notificacoesPedidosEventos = notificacoes.notificacoesPedidosEventos || [];
    }

    let estadoNotificacao = "NaoLida";
    let dataNotificacao = new Date().toLocaleString("pt-PT");
    let estadoMensagemPedEvento = "NaoLida";

    const pedidosEventos = JSON.parse(localStorage.getItem('pedidosEventos'));
    const pedido = pedidosEventos.find(p => p.id === pedidoId);

    if (pedido) {
        notificacoes.notificacoesPedidosEventos.push({
            dataNotificacaoPedEvento: dataNotificacao,
            idPedidoPedEvento: pedidoId,
            estadoNotificacaoPedEvento: estadoNotificacao,
            mensagemPedEvento: mensagemResposta,
            estadoMensagemPedEvento: estadoMensagemPedEvento,
            tituloPedidoPedEvento: pedido.tituloPedidoEvento,
            submissaoDataPedidoEvento: pedido.submissaoDataPedidoEvento,
            nomePedidoPedEvento: pedido.nomePedidoEvento,
            emailPedidoPedEvento: pedido.emailPedidoEvento
        });
        localStorage.setItem('notificacoes', JSON.stringify(notificacoes)); // Salva as alterações no localStorage
    } else {
        console.error('Pedido não encontrado');
    }
}

function adicionarEvento(pedidoId) {
    const pedidos = JSON.parse(localStorage.getItem('pedidosEventos'));
    const pedido = pedidos.find(pedido => pedido.id === pedidoId);

    if (!pedido) {
        console.error('Pedido não encontrado');
        return;
    }

    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    const materiaisTabela = JSON.parse(localStorage.getItem('materiais')) || [];

    // Encontrar o ID máximo e gerar um novo ID
    let idMaximo = 0;
    eventos.forEach(evento => {
        if (evento.id && evento.id.startsWith("ev")) {
            let idAtual = parseInt(evento.id.substring(2));
            if (idAtual > idMaximo) {
                idMaximo = idAtual;
            }
        }
    });
    let proximoId = idMaximo + 1;
    let novoIdEvento = "ev" + proximoId;

    const novoEvento = {
        id: novoIdEvento,
        tituloEvento: pedido.tituloPedidoEvento,
        descricaoEvento: pedido.descricaoPedidoEvento,
        dataEvento: pedido.dataPretendidaPedidoEvento,
        localEvento: pedido.localPedidoEvento,
        duracaoEvento: pedido.duracaoPedidoEvento,
        tipo: pedido.tipoPedidoEvento,
        imagemEvento: pedido.imagemOrganizarEvento,
        precoInscricaoEvento: pedido.precoInscricaoEvento,
        inscricoes: [],
        colaboradores: [],
        materiais: [],
        ficheiros: [],
        comentarios: [],
        status: "por Realizar"
    };

    // Preencher os colaboradores selecionados
    const colaboradoresSelecionados = Array.from(document.querySelectorAll('#modalProfissionaisSelecionados .professional-item span')).map(span => {
        const email = span.getAttribute('data-professional-email');
        const colaborador = JSON.parse(localStorage.getItem('colaboradoresORG')).find(col => col.emailColaborador === email);
        return {
            email: colaborador.emailColaborador,
            password: colaborador.passwordColaborador || 'N/A'
        };
    });
    novoEvento.colaboradores = colaboradoresSelecionados;

    // Preencher os materiais selecionados e atualizar o stock
    const materiaisSelecionados = Array.from(document.querySelectorAll('.material-item span')).map(span => {
        let materialNome = span.getAttribute('data-material');
        let quantidadeSelecionada = parseInt(span.nextElementSibling.value);
        let materialInfo = materiaisTabela.find(m => m.designacao === materialNome);

        if (materialInfo) {
            materialInfo.qtd -= quantidadeSelecionada;

            return {
                id: materialInfo.id,
                designacao: materialInfo.designacao,
                qtd: quantidadeSelecionada,
                status: "naoConfirmado"
            };
        }
    }).filter(item => item !== undefined);

    localStorage.setItem("materiais", JSON.stringify(materiaisTabela));
    novoEvento.materiais = materiaisSelecionados;

    eventos.push(novoEvento);
    localStorage.setItem('eventos', JSON.stringify(eventos));
}

function popularSelects() {
    const materiaisSelect = document.getElementById('modalMateriaisSelect');
    const colaboradoresSelect = document.getElementById('modalProfissionaisSelect');
    const profissionaisSelecionadosContainer = document.getElementById('modalProfissionaisSelecionados');

    const materiais = JSON.parse(localStorage.getItem('materiais')) || [];
    const colaboradores = JSON.parse(localStorage.getItem('colaboradoresORG')) || [];

    materiaisSelect.innerHTML = '<option disabled selected value="">Materiais</option>';
    colaboradoresSelect.innerHTML = '<option disabled selected value="">Profissionais</option>';

    materiais.forEach(material => {
        const option = document.createElement('option');
        option.value = material.id;
        option.textContent = material.designacao;
        materiaisSelect.appendChild(option);
    });

    colaboradores.forEach(colaborador => {
        const option = document.createElement('option');
        option.value = colaborador.emailColaborador;
        option.textContent = colaborador.nomeColaborador + " (" + colaborador.funcaoColaborador + ")";
        colaboradoresSelect.appendChild(option);
    });

    materiaisSelect.addEventListener('change', function() {
        var selectedMaterial = materiaisSelect.options[materiaisSelect.selectedIndex].text;
        var existingMaterialDiv = document.querySelector(`.material-item span[data-material="${selectedMaterial}"]`);

        if (existingMaterialDiv) {
            existingMaterialDiv.parentElement.remove(); // Remove o div existente
        } else {
            var materialDiv = document.createElement('div');
            materialDiv.className = 'material-item';
            materialDiv.innerHTML = `
            <span data-material="${selectedMaterial}">${selectedMaterial}</span>
            <input type="number" min="1" name="quantidade-${selectedMaterial}" class="form-control mb-0" placeholder="Quantidade" required>
            `;
            document.getElementById('modalMateriaisSelecionados').appendChild(materialDiv);

            var inputQuantidade = materialDiv.querySelector('input');
            inputQuantidade.addEventListener('change', function() {
                verificarStock(selectedMaterial, inputQuantidade);
            });
        }

        materiaisSelect.value = ""; // Limpa o campo de seleção
    });

    colaboradoresSelect.addEventListener('change', function() {
        const selectedProfessional = colaboradoresSelect.options[colaboradoresSelect.selectedIndex].text;
        const selectedEmail = colaboradoresSelect.value;
        const existingProfessionalDiv = document.querySelector(`.professional-item span[data-professional="${selectedProfessional}"]`);
        const colaboradoresORG = JSON.parse(localStorage.getItem('colaboradoresORG')) || [];
        const evento_records = JSON.parse(localStorage.getItem("eventos")) || [];
        const dataEventoInput = document.getElementById('data-pedido-evento-info').textContent; // Obtendo a data do evento atual
        const localEventoSelect = document.getElementById('local-pedido-evento-info');
        const localEvento = localEventoSelect ? localEventoSelect.textContent : '';

        const colaborador = colaboradoresORG.find(col => col.nomeColaborador + " (" + col.funcaoColaborador + ")" === selectedProfessional);

        const associadoOutroEvento = evento_records.some(evento => {
            console.log("Verificando evento:", evento.id);
            console.log("Emails dos colaboradores do evento:", evento.colaboradores.map(col => col.email));
            console.log(dataEventoInput);
            return evento.colaboradores.some(col => col.email === colaborador.emailColaborador) && formatarData(evento.dataEvento) === dataEventoInput;
        });

        if (associadoOutroEvento) {
            colaboradoresSelect.value = "";
            alert('Este colaborador já está associado a outro evento na mesma data e local.');
            console.log("Conflito encontrado para colaborador:", colaborador.emailColaborador);
            return;
        }

        if (existingProfessionalDiv) {
            existingProfessionalDiv.parentElement.remove(); // Remove o div existente
        } else {
            var professionalDiv = document.createElement('div');
            professionalDiv.className = 'professional-item';
            professionalDiv.innerHTML = `
                <span data-professional="${selectedProfessional}" data-professional-email="${selectedEmail}">${selectedProfessional}</span>
            `;
            profissionaisSelecionadosContainer.appendChild(professionalDiv);
        }

        // Verifica se há itens no container
        if (profissionaisSelecionadosContainer.children.length > 0) {
            profissionaisSelecionadosContainer.style.display = "block";
        } else {
            profissionaisSelecionadosContainer.style.display = "none";
        }

        colaboradoresSelect.value = ""; // Limpa o campo de seleção
    });
}

function fecharDetalhesModalAbrirRespostaModal() {
    var detalhesModal = bootstrap.Modal.getInstance(document.getElementById('detalhes-Eventos'));
    detalhesModal.hide();
    var respostaModal = new bootstrap.Modal(document.getElementById('mensagemRespostaPedido'), {
        backdrop: 'static',
        keyboard: false
    });
    respostaModal.show();
}

function fecharModais() {
    var respostaModal = bootstrap.Modal.getInstance(document.getElementById('mensagemRespostaPedido'));
    respostaModal.hide();
    var detalhesModal = bootstrap.Modal.getInstance(document.getElementById('detalhes-Eventos'));
    detalhesModal.hide();
    // Atualiza a tabela após fechar os modais
    const currentPage = parseInt(document.querySelector('.pagination .active .page-link').getAttribute('data-page'));
    preencherTabelaPedidosEventos(currentPage);
}

// Verificação de conflitos para colaboradores na mesma data
function verificarConflitoColaborador(colaboradorEmail, dataEvento, localEvento) {
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    
    return eventos.some(evento => {
        return evento.colaboradores.some(col => col.email === colaboradorEmail) && evento.dataEvento === dataEvento && evento.localEvento === localEvento;
    });
}


function verificarStock(materialNome, inputStock) {
    const materiaisTabela = JSON.parse(localStorage.getItem("materiais")) || [];

    const material = materiaisTabela.find(m => m.designacao === materialNome);
    if (material && inputStock.value > material.qtd) {
        alert(`Quantidade solicitada de ${materialNome} excede o stock disponível (${material.qtd})`);
        inputStock.value = material.qtd;
        inputStock.style.borderColor = 'red';
    } else {
        inputStock.style.borderColor = '';
    }
}
