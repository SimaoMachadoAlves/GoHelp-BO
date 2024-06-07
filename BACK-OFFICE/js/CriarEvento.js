/*Eventos Criar */
document.addEventListener("DOMContentLoaded", function () {

    popularSelects()

    var selectTipoEvento = document.getElementById('tipo-criar-evento');
    selectTipoEvento.addEventListener('change', atualizarVisibilidadePreco);


    // Atribui o valor mínimo ao campo da data no carregamento da página
    var dataEventoInput = document.getElementById('data-evento');
    var duracaoEventoInput = document.getElementById('duracao-evento');
    var today = new Date().toISOString().substring(0, 16);
    dataEventoInput.min = today;
    // Tratar Datas Horas
    dataEventoInput.addEventListener('change', verificarSobreposicao);
    duracaoEventoInput.addEventListener('change', verificarSobreposicao);


    //Tratar materiais e profissionais

    var materiaisSelect = document.getElementById('materiais-evento');
    var profissionaisSelect = document.getElementById('profissionais-evento');
    var materiaisSelecionadosContainer = document.getElementById('lista-materiais-selecionados');
    var profissionaisSelecionadosContainer = document.getElementById('lista-profissionais-selecionados');

    materiaisSelect.addEventListener('change', function () {
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
            materiaisSelecionadosContainer.appendChild(materialDiv);

            var inputQuantidade = materialDiv.querySelector('input');
            inputQuantidade.addEventListener('change', function () {
                verificarStock(selectedMaterial, inputQuantidade);
            });
        }

        // Verifica se há itens no container
        if (materiaisSelecionadosContainer.children.length > 0) {
            materiaisSelecionadosContainer.style.display = "block";
        } else {
            materiaisSelecionadosContainer.style.display = "none";
        }

        materiaisSelect.value = ""; // Limpa o campo de seleção
    });

    profissionaisSelect.addEventListener('change', function () {
        var selectedProfessional = profissionaisSelect.options[profissionaisSelect.selectedIndex].text;
        var existingProfessionalDiv = document.querySelector(`.professional-item span[data-professional="${selectedProfessional}"]`);
        var colaboradoresORG = JSON.parse(localStorage.getItem('colaboradoresORG')) || [];
        var evento_records = JSON.parse(localStorage.getItem("eventos")) || [];
        var dataEventoInput = document.getElementById('data-evento').value;
        var localEventoSelect = document.getElementById('local-evento');
        var localEvento = localEventoSelect.options[localEventoSelect.selectedIndex].text;

        var colaborador = colaboradoresORG.find(col => col.nomeColaborador + " (" + col.funcaoColaborador + ")" === selectedProfessional);

        var associadoOutroEvento = evento_records.some(evento => {
            console.log("Verificando evento:", evento.id);
            console.log("Emails dos colaboradores do evento:", evento.colaboradores.map(col => col.email));
            return evento.colaboradores.some(col => col.email === colaborador.emailColaborador) && evento.dataEvento === dataEventoInput
        });

        if (associadoOutroEvento) {
            profissionaisSelect.value = ""
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
                <span data-professional="${selectedProfessional}">${selectedProfessional}</span>
            `;
            profissionaisSelecionadosContainer.appendChild(professionalDiv);
        }

        // Verifica se há itens no container
        if (profissionaisSelecionadosContainer.children.length > 0) {
            profissionaisSelecionadosContainer.style.display = "block";
        } else {
            profissionaisSelecionadosContainer.style.display = "none";
        }

        profissionaisSelect.value = ""; // Limpa o campo de seleção
    });


    const criarEventoForm = document.getElementById("criarEventoForm");
    const modalCriarEvento = new bootstrap.Modal(document.getElementById('confirmationModalCriarEvento'));

    criarEventoForm.addEventListener("submit", function (event) {
        event.preventDefault();
        modalCriarEvento.show();
    });

    document.getElementById('botaoCriarEvento').addEventListener('click', function () {
        criarEvento();
    });
});


function verificarSobreposicao() {
    var dataEventoInput = document.getElementById('data-evento');
    var duracaoEventoInput = document.getElementById('duracao-evento');
    var dataEvento = new Date(dataEventoInput.value);
    var duracaoEvento = parseInt(duracaoEventoInput.value);
    var agora = new Date();
    var localEvento = document.getElementById('local-evento').options[document.getElementById('local-evento').selectedIndex].text;

    if (!dataEventoInput.value || !duracaoEventoInput.value) {
        return; // Sai da função se data ou duração não estiverem preenchidas
    }

    if (dataEvento < agora) {
        alert('A data e hora do evento não podem ser anteriores à data e hora atuais.');
        dataEventoInput.value = '';
        return;
    }

    let evento_records = JSON.parse(localStorage.getItem("eventos")) || [];
    let dataFinalEventoSelc = new Date(dataEvento.getTime() + duracaoEvento * 3600000);

    let overlap = evento_records.some(evento => {
        let startExistingEvent = new Date(evento.dataEvento);
        let endExistingEvent = new Date(startExistingEvent.getTime() + parseInt(evento.duracaoEvento) * 3600000);

        if (localEvento == evento.localEvento && dataEvento < endExistingEvent && dataFinalEventoSelc > startExistingEvent) {
            return true;
        }
        return false;
    });

    if (overlap) {
        alert('Já existe um evento neste local e data.');
        dataEventoInput.value = '';
        duracaoEventoInput.value = '';
    } else {
        console.log("Nenhuma sobreposição detectada. Evento pode ser agendado.");
    }
}



function popularSelects() {
    var materiaisSelect = document.getElementById('materiais-evento');
    var profissionaisSelect = document.getElementById('profissionais-evento');
    materiaisSelect.innerHTML = '<option disabled selected value="">Materiais</option>'
    profissionaisSelect.innerHTML = '<option disabled selected value="">Profissionais</option>'

    var materiais = JSON.parse(localStorage.getItem('materiais')) || [];
    var colaboradoresORG = JSON.parse(localStorage.getItem('colaboradoresORG')) || [];

    // Popular o select de materiais
    materiais.forEach(material => {
        var option = document.createElement('option');
        option.value = material.designacao;
        option.text = material.designacao;
        materiaisSelect.add(option);
    });

    // Popular o select de profissionais
    colaboradoresORG.forEach(profissional => {
        var option = document.createElement('option');
        option.value = profissional.nomeColaborador;
        option.text = profissional.nomeColaborador + " (" + profissional.funcaoColaborador + ")";
        profissionaisSelect.add(option);
    });
}






function atualizarVisibilidadePreco() {
    var tipoEvento = document.getElementById("tipo-criar-evento").value;
    var label = document.getElementById("label-preco");
    var input = document.getElementById("input-preco");
    var campoPreco = document.getElementById("preco-evento-inscricao");

    //Procurar data e duração selecionada (já verificada)
    var dataEventoInput = document.getElementById('data-evento');
    var dataEvento = new Date(dataEventoInput.value);
    var duracaoEventoInput = document.getElementById("duracao-evento").value;
    let dataFinalEventoSelc = new Date(dataEvento.getTime() + duracaoEventoInput * 3600000);
    const dias3 = 259200000 // 3 dias em ms

    var selectTipoEvento = document.getElementById("tipo-criar-evento").options[document.getElementById("tipo-criar-evento").selectedIndex].text;


    let evento_records = JSON.parse(localStorage.getItem("eventos")) || [];
    let overlap = evento_records.some(evento => {
        let startExistingEvent = new Date(evento.dataEvento);
        let endExistingEvent = new Date(startExistingEvent.getTime() + parseInt(evento.duracaoEvento) * 3600000);


        console.log("Início do evento existente:", startExistingEvent);
        console.log("Fim do evento existente:", endExistingEvent);

        console.log("Selecionado:", dataEvento);
        console.log("Final Selecionado:", dataFinalEventoSelc);

        console.log("tipo evento:", evento.tipo);
        console.log("tipo novo evento:", selectTipoEvento);

        if (selectTipoEvento == evento.tipo) {
            const diferenca1 = dataEvento - endExistingEvent;
            if (diferenca1 > 0 && diferenca1 < dias3) return true;

            // Verifica se a data final do novo evento está dentro de 3 dias antes da data inicial do evento existente
            const diferenca2 = startExistingEvent - dataFinalEventoSelc;
            if (diferenca2 > 0 && diferenca2 < dias3) return true;

            console.log("Sobreposição não detectada",);
            return false;
        }
        return false;
    });


    if (overlap) {
        campoPreco.value = "";
        input.value = "";
        label.style.display = "none"; // Esconde se não houver seleção
        input.style.display = "none";
        document.getElementById("tipo-criar-evento").value = ""; // Redefine o select para o valor padrão
        alert('Existe um evento com o mesmo tipo muito proximo! Por favor alterar');
        return;
    }
    else {
        if (tipoEvento) {
            label.style.display = "block";
            input.style.display = "block";

            if (tipoEvento === "1" || tipoEvento === "0") { // Se for Feira do Livro
                campoPreco.value = "Gratuito";
                campoPreco.setAttribute("readonly", true);
            } else {
                campoPreco.value = ""; // Limpa o valor
                campoPreco.removeAttribute("readonly"); // Permite edição
            }
        } else {
            label.style.display = "none"; // Esconde se não houver seleção
            input.style.display = "none";
        }
    }
}



function verificarStock(materialNome, inputStock) {
    const materiaisTabela = JSON.parse(localStorage.getItem("materiais")) || [];

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




function criarEvento() {
    let tituloEvento = document.getElementById("titulo-evento").value;
    let descricaoEvento = document.getElementById("descricao-evento").value;
    let localEvento = document.getElementById("local-evento").options[document.getElementById("local-evento").selectedIndex].text;
    let duracaoEvento = document.getElementById("duracao-evento").value;
    let tipo = document.getElementById("tipo-criar-evento").options[document.getElementById("tipo-criar-evento").selectedIndex].text;
    let dataEvento = document.getElementById("data-evento").value;
    let precoInscricaoEvento = document.getElementById("preco-evento-inscricao").value;
    let fileImagemEvento = document.getElementById("imagemParaEvento").files[0].name;

    

        let evento_records = JSON.parse(localStorage.getItem("eventos")) || [];
        let materiaisTabela = JSON.parse(localStorage.getItem("materiais")) || [];
        let colaboradoresORG = JSON.parse(localStorage.getItem('colaboradoresORG')) || [];

        let idMaximo = 0;
        evento_records.forEach(evento => {
            if (evento.id && evento.id.startsWith("ev")) {
                let idAtual = parseInt(evento.id.substring(2));
                if (idAtual > idMaximo) {
                    idMaximo = idAtual;
                }
            }
        });
        let proximoId = idMaximo + 1;
        let novoIdEvento = "ev" + proximoId;

        let materiaisSelecionados = Array.from(document.querySelectorAll('.material-item')).map(div => {
            let materialNome = div.querySelector('span').dataset.material;
            let quantidadeSelecionada = parseInt(div.querySelector('input').value);
            let materialInfo = materiaisTabela.find(m => m.designacao === materialNome);

            if (materialInfo) {
                materialInfo.qtd -= quantidadeSelecionada;

                return {
                    "id": materialInfo.id,
                    "designacao": materialInfo.designacao,
                    "qtd": quantidadeSelecionada,
                    "status": "naoConfirmado"
                };
            }
        }).filter(item => item !== undefined);

        localStorage.setItem("materiais", JSON.stringify(materiaisTabela));

        let profissionaisSelecionados = Array.from(document.querySelectorAll('.professional-item span')).map(span => {
            let nomeCompleto = span.dataset.professional;
            let colaborador = colaboradoresORG.find(col => col.nomeColaborador + " (" + col.funcaoColaborador + ")" === nomeCompleto);
            return {
                "email": colaborador.emailColaborador,
                "password": colaborador.passwordColaborador
            };
        }).filter(item => item !== undefined);

        evento_records.push({
            "id": novoIdEvento,
            "tituloEvento": tituloEvento,
            "descricaoEvento": descricaoEvento,
            "localEvento": localEvento,
            "duracaoEvento": duracaoEvento,
            "tipo": tipo,
            "dataEvento": dataEvento,
            "imagemEvento": fileImagemEvento,
            "precoInscricaoEvento": precoInscricaoEvento,
            "inscricoes": [],
            "colaboradores": profissionaisSelecionados,
            "materiais": materiaisSelecionados,
            "ficheiros": [],
            "comentarios": [],
            "status": "por Realizar"
        });

        localStorage.setItem("eventos", JSON.stringify(evento_records));

        var confirmationModalEvento = bootstrap.Modal.getInstance(document.getElementById('confirmationModalCriarEvento'));
        confirmationModalEvento.hide();

        var eventoCriadoModal = new bootstrap.Modal(document.getElementById('criarEventoEfetuado'));
        eventoCriadoModal.show();

        window.location.href = "vereventos.html";

}












