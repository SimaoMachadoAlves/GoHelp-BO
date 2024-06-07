document.addEventListener("DOMContentLoaded", function() {
    

    const addLocalForm = document.getElementById("addLocalForm");
    const modalAdicionarLocal = new bootstrap.Modal(document.getElementById('confirmationModalAdicionarLocal'));

    addLocalForm.addEventListener("submit", function(event) {
        event.preventDefault();
        modalAdicionarLocal.show();
    });

    document.getElementById('botaoAdicionarLocal').addEventListener('click', function () {
        adicionarLocal();
    });
});

function adicionarLocal() {
    let nomeLocal = document.getElementById("nome-local").value;
    let tipoLocal = document.getElementById("tipo-local").value;
    let moradaLocal = document.getElementById("morada-local").value;
    let capacidadeLocal = document.getElementById("capacidade").value;
    let descricaoLocal = document.getElementById("descricao-local").value;
    
    let locais = JSON.parse(localStorage.getItem("locais")) || [];

    locais.push({
        "nome": nomeLocal,
        "tipo": tipoLocal,
        "morada": moradaLocal,
        "capacidade": capacidadeLocal,
        "descricao": descricaoLocal
    });

    localStorage.setItem("locais", JSON.stringify(locais));

    var confirmationModalEvento = bootstrap.Modal.getInstance(document.getElementById('confirmationModalAdicionarLocal'));
    confirmationModalEvento.hide();

    var eventoCriadoModal = new bootstrap.Modal(document.getElementById('LocalAdicionado'));
    eventoCriadoModal.show();

    window.location.href = "locais.html";
}
