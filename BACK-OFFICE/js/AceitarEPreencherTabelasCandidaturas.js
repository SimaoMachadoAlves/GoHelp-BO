document.addEventListener("DOMContentLoaded", function() {
    preencherTabelaPedidosTrabalho();
    adicionarEventosModalTrabalho();
    adicionarEventoApagarRecusados();
    configurarPaginacao();
});

function preencherTabelaPedidosTrabalho(pagina = 1) {
    const pedidosTrabalho = JSON.parse(localStorage.getItem("pedidosTrabalho")) || [];

    if (pedidosTrabalho.length === 0) {
        console.log("Nenhum pedido de trabalho encontrado no localStorage.");
        document.getElementById("conteudo-tabela-pedidos-trabalho").innerHTML = ""; // Clear table if empty
        return;
    }

    pedidosTrabalho.sort((a, b) => {
        const dataA = Date.parse(a.submissaoDataPedidoTrabalho.replace(/(\d{2})\/(\d{2})\/(\d{4}), (\d{2}:\d{2}:\d{2})/, '$3-$2-$1T$4'));
        const dataB = Date.parse(b.submissaoDataPedidoTrabalho.replace(/(\d{2})\/(\d{2})\/(\d{4}), (\d{2}:\d{2}:\d{2})/, '$3-$2-$1T$4'));
        return dataB - dataA;
    });

    const itensPorPagina = 7;
    const inicio = (pagina - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const paginaPedidosTrabalho = pedidosTrabalho.slice(inicio, fim);

    const tabelaBody = document.getElementById("conteudo-tabela-pedidos-trabalho");
    tabelaBody.innerHTML = "";

    paginaPedidosTrabalho.forEach((pedido, index) => {
        const badgeClasse = pedido.estadoPedidoTrabalho.includes('Aceite') ? 'badge-verde' :
                            (pedido.estadoPedidoTrabalho.includes('Pendente') ? 'badge-amarelo' : 'badge-vermelho');
        const linha = `<tr>
            <td>${pedido.submissaoDataPedidoTrabalho}</td>
            <td><a href="#" onclick="abrirCV('images/${pedido.cVPedidoTrabalho}', 'images/CV_${pedido.nomePedidoTrabalho}.pdf'); return false;" style="text-decoration:underline; color: black">Ver CV</a></td>
            <td><div class="badge ${badgeClasse}">${pedido.estadoPedidoTrabalho.replace(/<.*?>/g, '')}</div></td>
            <td><a href="#" data-toggle="modal" data-id="${pedido.id}" class="link-ver-detalhes-trabalho" style="text-decoration:underline; color: black">Ver Detalhes</a></td>
            <td class="text-end">
            <i class="bi bi-x-square" style="cursor:pointer;" onclick="removerPedidoTrabalho(${index})"></i></td>
        </tr>`;
        tabelaBody.innerHTML += linha;
    });

    adicionarEventosLinksDetalhes();
    criarPaginacao(pagina, Math.ceil(pedidosTrabalho.length / itensPorPagina));
}

function adicionarEventoApagarRecusados() {
    const botaoApagarRecusados = document.getElementById("apagar-rec-usados");
    if (botaoApagarRecusados) {
        botaoApagarRecusados.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default button click behavior
            console.log("Apagar Recusados button clicked");
            let pedidosTrabalho = JSON.parse(localStorage.getItem("pedidosTrabalho")) || [];
            if (pedidosTrabalho.length === 0) {
                console.log("Nenhum pedido de trabalho encontrado no localStorage.");
                return;
            }
            const pedidosAntes = pedidosTrabalho.length;
            pedidosTrabalho = pedidosTrabalho.filter(pedido => !pedido.estadoPedidoTrabalho.includes('Recusado'));
            const pedidosDepois = pedidosTrabalho.length;

            if (pedidosAntes === pedidosDepois) {
                console.log("Nenhum pedido de trabalho recusado encontrado para apagar.");
                return;
            }

            localStorage.setItem("pedidosTrabalho", JSON.stringify(pedidosTrabalho));
            preencherTabelaPedidosTrabalho();
            configurarPaginacao();
        });
    }
}

function adicionarEventosLinksDetalhes() {
    const linksDetalhes = document.querySelectorAll('.link-ver-detalhes-trabalho');
    linksDetalhes.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const pedidoId = link.getAttribute('data-id');
            document.querySelectorAll('.link-ver-detalhes-trabalho').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            preencherDetalhesModalTrabalho(pedidoId);
            abrirModalDetalhes(pedidoId);
        });
    });
}

function criarPaginacao(paginaAtual, totalPaginas) {
    const paginacao = document.querySelector('.paginacao-tabelas .pagination');
    paginacao.innerHTML = '';

    paginacao.appendChild(criarItemPagina('«', 'prev', paginaAtual));
    for (let i = 1; i <= totalPaginas; i++) {
        paginacao.appendChild(criarItemPagina(i.toString(), i, paginaAtual));
    }
    paginacao.appendChild(criarItemPagina('»', 'next', paginaAtual));
}

function criarItemPagina(texto, pagina, paginaAtual) {
    const item = document.createElement('li');
    item.className = 'page-item';
    const totalPaginas = Math.ceil(JSON.parse(localStorage.getItem("pedidosTrabalho")).length / 7);
    if ((pagina === 'prev' && paginaAtual === 1) || (pagina === 'next' && paginaAtual === totalPaginas)) {
        item.classList.add('disabled');
    }
    if (pagina === paginaAtual) {
        item.classList.add('active');
    }
    const link = document.createElement('a');
    link.className = 'page-link';
    link.href = '#';
    link.innerHTML = texto;
    link.dataset.page = pagina;
    item.appendChild(link);
    return item;
}

function configurarPaginacao() {
    const paginacao = document.querySelector('.paginacao-tabelas .pagination');
    paginacao.addEventListener('click', function(event) {
        const target = event.target;
        if (target.tagName === 'A') {
            let pagina = target.dataset.page;
            const paginaAtual = document.querySelector('.paginacao-tabelas .pagination .active .page-link').dataset.page;
            if (pagina === 'prev') {
                pagina = Math.max(1, parseInt(paginaAtual) - 1);
            } else if (pagina === 'next') {
                const totalPaginas = Math.ceil(JSON.parse(localStorage.getItem("pedidosTrabalho")).length / 7);
                pagina = Math.min(totalPaginas, parseInt(paginaAtual) + 1);
            } else {
                pagina = parseInt(pagina);
            }
            preencherTabelaPedidosTrabalho(pagina);
        }
    });
}

function adicionarEventosModalTrabalho() {
    const botaoAceitar = document.getElementById('botaoAceitarPedidoTrabalho');
    const botaoRecusar = document.getElementById('botaoRecusarPedidoTrabalho');
    const enviarRespostaPedidoBotao = document.getElementById('enviarRespostaPedidoBotaoTrabalho');

    if (botaoAceitar) {
        botaoAceitar.addEventListener('click', function() {
            const pedidoId = document.querySelector('.link-ver-detalhes-trabalho.active').getAttribute('data-id');
            redirecionarParaAdicionarColaborador(pedidoId);
        });
    }

    if (botaoRecusar) {
        botaoRecusar.addEventListener('click', function() {
            const pedidoId = document.querySelector('.link-ver-detalhes-trabalho.active').getAttribute('data-id');
            processarPedidoTrabalho(pedidoId, 'Recusado');
        });
    }

    if (enviarRespostaPedidoBotao) {
        enviarRespostaPedidoBotao.addEventListener('click', function() {
            const mensagemResposta = document.getElementById('responder-pedido-trabalho-message').value;
            const pedidoId = document.querySelector('.link-ver-detalhes-trabalho.active').getAttribute('data-id');
            enviarRespostaPedido(pedidoId, mensagemResposta);
        });
    }
}

function redirecionarParaAdicionarColaborador(pedidoId) {
    const params = new URLSearchParams({
        id: pedidoId,
        fromCandidatura: 'true'
    });

    window.location.href = `addcolaborador.html?${params.toString()}`;
}

function processarPedidoTrabalho(pedidoId, estadoTemporario) {
    const pedidosTrabalho = JSON.parse(localStorage.getItem("pedidosTrabalho")) || [];
    const pedidoIndex = pedidosTrabalho.findIndex(p => p.id === pedidoId);

    if (pedidoIndex !== -1) {
        let pedido = pedidosTrabalho[pedidoIndex];
        pedido.estadoPedidoTrabalho = `<div class='badge ${estadoTemporario === 'Recusado' ? 'badge-vermelho' : 'badge-verde'}'>${estadoTemporario}</div>`;
        pedidosTrabalho[pedidoIndex] = pedido;
        localStorage.setItem("pedidosTrabalho", JSON.stringify(pedidosTrabalho));
        preencherTabelaPedidosTrabalho();
        fecharModal();  // Fechar o modal independente do estado
    } else {
        console.error('Pedido de trabalho não encontrado para atualizar estado.');
    }
}

function removerPedidoTrabalho(index) {
    let pedidosTrabalho = JSON.parse(localStorage.getItem("pedidosTrabalho"));
    if (pedidosTrabalho) {
        pedidosTrabalho.splice(index, 1);
        localStorage.setItem("pedidosTrabalho", JSON.stringify(pedidosTrabalho));
        preencherTabelaPedidosTrabalho();
    }
}

function abrirCV(url) {
    // Abre a URL do PDF em uma nova aba
    window.open(url, '_blank');
}

function preencherDetalhesModalTrabalho(id) {
    const pedidosTrabalho = JSON.parse(localStorage.getItem("pedidosTrabalho"));
    const pedido = pedidosTrabalho.find(pedido => pedido.id === id);

    if (!pedido) {
        console.log("Pedido de trabalho não encontrado.");
        return;
    }

    document.getElementById("nome-envio-trabalho-info").textContent = pedido.nomePedidoTrabalho;
    document.getElementById("email-envio-trabalho-info").textContent = pedido.emailPedidoTrabalho;
    document.getElementById("contacto-envio-trabalho-info").textContent = pedido.numeroTelefonico;
    document.getElementById("data-envio-trabalho-info").textContent = pedido.submissaoDataPedidoTrabalho;
    document.getElementById("assunto-pedido-trabalho-info").textContent = pedido.assuntoPedidoTrabalho;
    document.getElementById("cv-pedido-trabalho-info").innerHTML = `<a href="#" onclick="abrirCV('images/${pedido.cVPedidoTrabalho}', 'images/CV_${pedido.nomePedidoTrabalho}.pdf'); return false;" style="text-decoration:underline; color: black">Ver CV</a>`;
    document.getElementById("comentario-pedido-trabalho-info").textContent = pedido.mensagemPedidoTrabalho;
    document.getElementById("estado-pedido-trabalho-info").innerHTML = pedido.estadoPedidoTrabalho;

    document.getElementById("nome-consulta-trabalho-info").textContent = pedido.nomePedidoTrabalho;
    document.getElementById("email-consulta-trabalho-info").textContent = pedido.emailPedidoTrabalho;
    document.getElementById("contacto-consulta-trabalho-info").textContent = pedido.numeroTelefonico;
    document.getElementById("data-consulta-trabalho-info").textContent = pedido.submissaoDataPedidoTrabalho;
    document.getElementById("assunto-consulta-trabalho-info").textContent = pedido.assuntoPedidoTrabalho;
    document.getElementById("cv-consulta-trabalho-info").innerHTML = `<a href="#" onclick="abrirCV('images/${pedido.cVPedidoTrabalho}', 'images/CV_${pedido.nomePedidoTrabalho}.pdf'); return false;" style="text-decoration:underline; color: black">Ver CV</a>`;
    document.getElementById("comentario-consulta-trabalho-info").textContent = pedido.mensagemPedidoTrabalho;
    document.getElementById("estado-consulta-trabalho-info").innerHTML = pedido.estadoPedidoTrabalho;
}

function abrirModalDetalhes(pedidoId) {
    const pedido = JSON.parse(localStorage.getItem("pedidosTrabalho")).find(pedido => pedido.id === pedidoId);

    if (pedido.estadoPedidoTrabalho.includes('Aceite') || pedido.estadoPedidoTrabalho.includes('Recusado')) {
        const consultaModal = new bootstrap.Modal(document.getElementById('detalhesConsultaPedidoTrabalho'));
        consultaModal.show();
    } else {
        const detalhesModal = new bootstrap.Modal(document.getElementById('detalhes-Eventos-Trabalho'));
        detalhesModal.show();
    }
}

function fecharModal() {
    const detalhesModalElement = document.getElementById('detalhes-Eventos-Trabalho');
    const consultaModalElement = document.getElementById('detalhesConsultaPedidoTrabalho');

    if (detalhesModalElement) {
        const detalhesModal = bootstrap.Modal.getInstance(detalhesModalElement);
        if (detalhesModal) {
            detalhesModal.hide();
        }
    }

    if (consultaModalElement) {
        const consultaModal = bootstrap.Modal.getInstance(consultaModalElement);
        if (consultaModal) {
            consultaModal.hide();
        }
    }
}
