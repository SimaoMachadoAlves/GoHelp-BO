/*PARTE DOS INPUTS DAS CATEGORIAS E MATERIAIS*/

const materiaisPorCategoria = {
    "Equipamento de Som": [
        { nome: "Colunas", preco: 100 },
        { nome: "Mesa de mistura", preco: 200 },
        { nome: "Microfones", preco: 50 },
        { nome: "Cabos de áudio", preco: 10 },
        { nome: "Amplificadores", preco: 150 },
        { nome: "Fones de ouvido", preco: 75 },
        { nome: "Equalizadores", preco: 120 },
        { nome: "Processadores de efeitos", preco: 180 }
    ],
    "Mobiliário": [
        { nome: "Mesas", preco: 80 },
        { nome: "Cadeiras", preco: 40 },
        { nome: "Estrados e palcos", preco: 300 },
        { nome: "Balcões de informação", preco: 250 },
        { nome: "Estantes", preco: 60 },
        { nome: "Sofás e poltronas", preco: 500 },
        { nome: "Biombos", preco: 100 }
    ],
    "Iluminação": [
        { nome: "Refletores", preco: 150 },
        { nome: "Luzes LED", preco: 200 },
        { nome: "Holofotes", preco: 300 },
        { nome: "Mesa de controle de luz", preco: 400 },
        { nome: "Cabos e conectores elétricos", preco: 20 },
        { nome: "Máquinas de fumaça", preco: 100 }
    ],
    "Equipamento de Vídeo": [
        { nome: "Projetores", preco: 1000 },
        { nome: "Câmeras de vídeo", preco: 800 },
        { nome: "Telas de projeção", preco: 150 },
        { nome: "Monitores de vídeo", preco: 300 }
    ],
    "Acessórios e Diversos": [
        { nome: "Barracas", preco: 500 },
        { nome: "Sinalização", preco: 30 },
        { nome: "Cordas e barreiras", preco: 20 },
        { nome: "Tapetes e pisos temporários", preco: 100 },
        { nome: "Geradores", preco: 2000 },
        { nome: "Decorações temáticas", preco: 150 },
        { nome: "Painéis de LED", preco: 600 }
    ],
    "Equipamento de Segurança": [
        { nome: "Extintores de incêndio", preco: 100 },
        { nome: "Câmeras de segurança", preco: 300 },
        { nome: "Kits de primeiros socorros", preco: 50 },
        { nome: "Rádios comunicadores", preco: 200 },
        { nome: "Detectores de metal", preco: 400 }
    ]
};

function carregarMateriais() {
    const categoriaSelecionada = document.getElementById('categoria').value;
    const selectMaterial = document.getElementById('material');
    selectMaterial.innerHTML = '<option value="">Selecione um Material</option>'; // Reset options
    if (categoriaSelecionada) {
        
        const materiais = materiaisPorCategoria[categoriaSelecionada] || [];
        materiais.forEach(material => {
            const option = document.createElement('option');
            option.value = material.nome;
            option.textContent = material.nome;
            option.dataset.preco = material.preco;
            selectMaterial.appendChild(option);
        });
        selectMaterial.disabled = false;
    } else {
        selectMaterial.disabled = true;
    }
}

/*------------------------------------------------------------------------------------------------*/

/*Adicionar valores ao localStorage */

document.addEventListener("DOMContentLoaded", function() {
    
    const addMaterialForm = document.getElementById("addMaterialForm");
    const modalAdicionarMaterial = new bootstrap.Modal(document.getElementById('confirmationModalAdicionarMaterial'));

    addMaterialForm.addEventListener("submit", function(event) {
        event.preventDefault();
        modalAdicionarMaterial.show();
    });

    document.getElementById('botaoAdicionarMaterial').addEventListener('click', function () {
        adicionarMaterial();
    });
});

function adicionarMaterial() {
    let categoria = document.getElementById("categoria").value;
    let nomeMaterial = document.getElementById("material").value;
    let quantidadeMaterial = parseInt(document.getElementById("quantidade").value);
    let descricaoMaterial = document.getElementById("descricao-material").value;

    // Recuperar os materiais do localStorage ou iniciar um array vazio
    let materiais = JSON.parse(localStorage.getItem("materiais")) || [];
    
    let precoMaterial = 0;
    const selectMaterial = document.getElementById("material");
    for (let i = 0; i < selectMaterial.options.length; i++) {
        if (selectMaterial.options[i].value === nomeMaterial) {
            precoMaterial = parseFloat(selectMaterial.options[i].dataset.preco);
            break;
        }
    }

    let materialExiste = false;

    // Percorrer a lista de materiais para verificar se o material já existe
    for (let i = 0; i < materiais.length; i++) {
        if (materiais[i].designacao === nomeMaterial && materiais[i].categoria === categoria) {
            // Se o material existe e pertence à mesma categoria, atualiza a quantidade
            materiais[i].qtd = parseInt(materiais[i].qtd) + quantidadeMaterial;
            materialExiste = true;
            break;
        }
    }

    // Se o material não existe, adiciona um novo material com um ID único
    if (!materialExiste) {
        let novoMaterial = {
            "id": materiais.length + 1,  // ID baseado no comprimento do array
            "designacao": nomeMaterial,
            "categoria": categoria,
            "qtd": quantidadeMaterial,
            "descricao": descricaoMaterial,
            "preco": precoMaterial
        };
        materiais.push(novoMaterial);
    }
    
    
    


    // Salvar a lista atualizada de materiais no localStorage
    localStorage.setItem("materiais", JSON.stringify(materiais));

    // Fechar o modal de confirmação e mostrar o modal de material adicionado
    let confirmationModalEvento = bootstrap.Modal.getInstance(document.getElementById('confirmationModalAdicionarMaterial'));
    confirmationModalEvento.hide();
    let eventoCriadoModal = new bootstrap.Modal(document.getElementById('materialAdicionado'));
    eventoCriadoModal.show();

    // Redirecionar para a página de organização dos materiais
    window.location.href = "materiaisorg.html";
}

