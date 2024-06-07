document.addEventListener('DOMContentLoaded', function () {
    var selectTipoColaborador = document.getElementById('colaborador-tipo');
    selectTipoColaborador.addEventListener('change', atualizarFuncoesPorTipo);

    const form = document.getElementById('addColaboradorform');
    const cancelButton = document.getElementById('cancelButton');
    const campoContactoColaborador = document.getElementById('colaborador-contacto');

    // Aplicar o evento de formatação ao campo de contato
    campoContactoColaborador.addEventListener('input', formatarContato);

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        adicionarColaborador();
    });

    // Evento para o botão de cancelamento
    cancelButton.addEventListener('click', function () {
        window.location.href = "colaboradores.html";
    });

    // Preencher campos se houver parâmetros na URL
    const urlParams = new URLSearchParams(window.location.search);
    const pedidoId = urlParams.get('id');
    const redirecionarDeCandidatura = urlParams.get('fromCandidatura') === 'true';

    if (pedidoId) {
        const pedidosTrabalho = JSON.parse(localStorage.getItem("pedidosTrabalho"));
        const pedido = pedidosTrabalho.find(pedido => pedido.id === pedidoId);

        if (pedido) {
            preencherCamposCandidatura(pedido);

            // Marcar o formulário como sendo de uma candidatura
            document.getElementById('form-origem').value = 'candidatura';

            // Salvar o estado temporário e a mensagem para uso posterior
            form.dataset.estado = urlParams.get('estado');
            form.dataset.mensagem = urlParams.get('mensagem');
        } else {
            console.error('Pedido de trabalho não encontrado.');
        }
    }
});

function preencherCamposCandidatura(pedido) {
    const nomeCampo = document.getElementById('nome-colaborador');
    const emailCampo = document.getElementById('colaborador-email');
    const descricaoCampo = document.getElementById('colaborador-descricao');
    const contactoCampo = document.getElementById('colaborador-contacto');

    nomeCampo.value = pedido.nomePedidoTrabalho;
    emailCampo.value = pedido.emailPedidoTrabalho;
    descricaoCampo.value = pedido.mensagemPedidoTrabalho;
    contactoCampo.value = pedido.numeroTelefonico;

    const tipoColaboradorCampo = document.getElementById('colaborador-tipo');
    tipoColaboradorCampo.value = "Interno";
    atualizarFuncoesPorTipo();
    const funcaoColaboradorCampo = document.getElementById('colaborador-funcao');
    funcaoColaboradorCampo.value = "Colaborador";

    // Tornar campos não editáveis
    nomeCampo.readOnly = true;
    emailCampo.readOnly = true;
    contactoCampo.readOnly = true;
    tipoColaboradorCampo.disabled = true;
    funcaoColaboradorCampo.disabled = true;
}

function atualizarFuncoesPorTipo() {
    var tipoColaborador = document.getElementById("colaborador-tipo").value;
    var campoFuncao = document.getElementById("colaborador-funcao");
    var campoPasswordColaborador = document.getElementById('colaborador-password');
    var labelPasswordColaborador = document.getElementById('label-password');

    var funcoesInterno = [
        { valor: "Administrador", texto: "Administrador" },
        { valor: "Colaborador", texto: "Colaborador" },
        { valor: "Fotógrafo", texto: "Fotógrafo" },
        { valor: "Motorista", texto: "Motorista" }
    ];

    var funcoesExterno = [
        { valor: "Segurança", texto: "Segurança" },
        { valor: "Enfermeiro", texto: "Enfermeiro" },
        { valor: "Colaborador Externo", texto: "Colaborador Externo" },
    ];

    campoFuncao.innerHTML = '<option disabled selected value=""></option>';

    var funcoes = tipoColaborador === "Interno" ? funcoesInterno : funcoesExterno;
    funcoes.forEach(funcao => {
        var option = document.createElement("option");
        option.value = funcao.valor;
        option.textContent = funcao.texto;
        campoFuncao.appendChild(option);
    });

    campoFuncao.disabled = false;

    // Mostra ou esconde o campo de senha e seu rótulo apenas para colaboradores internos
    var exibirSenha = tipoColaborador === "Interno";
    campoPasswordColaborador.style.display = exibirSenha ? "block" : "none";
    labelPasswordColaborador.style.display = exibirSenha ? "block" : "none";
}

function formatarContato(e) {
    // Remove caracteres que não sejam números
    let valor = e.target.value.replace(/\D/g, '');

    // Limita a 9 dígitos (telemóvel)
    valor = valor.slice(0, 9);

    // Formato: XXX XXX XXX
    if (valor.length > 6) {
        valor = valor.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
    } else if (valor.length > 3) {
        valor = valor.replace(/(\d{3})(\d{3})/, '$1 $2');
    }

    e.target.value = valor;
}

function adicionarColaborador() {
    const campoContactoColaborador = document.getElementById('colaborador-contacto');
    const campoPasswordColaborador = document.getElementById('colaborador-password');

    let nomeColaborador = document.getElementById('nome-colaborador').value;
    let contactoColaborador = campoContactoColaborador.value;
    let emailColaborador = document.getElementById('colaborador-email').value;
    let passwordColaborador = campoPasswordColaborador.value;
    let descricaoColaborador = document.getElementById('colaborador-descricao').value;
    let tipoColaborador = document.getElementById('colaborador-tipo').value;
    let funcaoColaborador = document.getElementById('colaborador-funcao').value;

    // Verifica se a senha é necessária para colaboradores internos
    if (tipoColaborador === "Interno" && !passwordColaborador) {
        alert('Por favor, preencha a senha para colaboradores internos.');
        return;
    }

    if (!nomeColaborador || !contactoColaborador || !emailColaborador || !descricaoColaborador || !tipoColaborador || !funcaoColaborador) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    // Obter data atual no formato "DD/MM/YYYY"
    let dataAtual = new Date();
    let dataCriacao = dataAtual.toLocaleDateString('pt-PT');

    let colaborador_records = JSON.parse(localStorage.getItem("colaboradoresORG")) || [];

    // Evitar problemas ao tentar encontrar IDs que podem estar null
    let ultimoId = colaborador_records.length
        ? Math.max(...colaborador_records.map(colab => colab.iddColaborador || 0))
        : 0;

    let proximoId = ultimoId + 1;

    let colaboradorData = {
        iddColaborador: proximoId,
        nomeColaborador,
        contactoColaborador,
        emailColaborador,
        passwordColaborador,
        descricaoColaborador,
        tipoColaborador,
        funcaoColaborador,
        dataCriacao
    };

    // Verificar duplicados antes de salvar
    let nomeDuplicado = colaborador_records.find(colab => colab.nomeColaborador === nomeColaborador);
    let contactoDuplicado = colaborador_records.find(colab => colab.contactoColaborador === contactoColaborador);
    let emailDuplicado = colaborador_records.find(colab => colab.emailColaborador === emailColaborador);

    if (nomeDuplicado || contactoDuplicado || emailDuplicado) {
        alert('Já existe um colaborador com o mesmo nome, contacto ou e-mail. Por favor, use informações diferentes.');
        return;
    }

    colaborador_records.push(colaboradorData);
    localStorage.setItem("colaboradoresORG", JSON.stringify(colaborador_records));

    // Verificar se a origem é uma candidatura
    const origem = document.getElementById('form-origem').value;
    if (origem === 'candidatura') {
        const pedidoId = new URLSearchParams(window.location.search).get('id');
        atualizarEstadoPedidoTrabalho('Aceite', pedidoId);
    }

    alert('Colaborador adicionado com sucesso!');
    window.location.href = "colaboradores.html";
}

function atualizarEstadoPedidoTrabalho(novoEstado, pedidoId) {
    const pedidosTrabalho = JSON.parse(localStorage.getItem("pedidosTrabalho")) || [];
    const pedidoIndex = pedidosTrabalho.findIndex(p => p.id === pedidoId);

    if (pedidoIndex !== -1) {
        let badgeClasse;
        if (novoEstado === 'Aceite') {
            badgeClasse = 'badge-verde';
        } else if (novoEstado === 'Pendente') {
            badgeClasse = 'badge-amarelo';
        } else if (novoEstado === 'Recusado') {
            badgeClasse = 'badge-vermelho';
        }

        pedidosTrabalho[pedidoIndex].estadoPedidoTrabalho = `<div class='badge ${badgeClasse}'>${novoEstado}</div>`;
        localStorage.setItem('pedidosTrabalho', JSON.stringify(pedidosTrabalho));
    } else {
        console.error('Pedido de trabalho não encontrado para atualizar estado.');
    }
}
