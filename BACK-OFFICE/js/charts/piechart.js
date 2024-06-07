// Função para obter os eventos do localStorage
function obterEventosDoLocalStorage() {
    var eventosJSON = localStorage.getItem("eventos");
    return eventosJSON ? JSON.parse(eventosJSON) : [];
}

// Função para contar os tipos de eventos
function contarTiposDeEventos(eventos) {
    var contagem = {
        'Feira do Livro': 0,
        'Concerto': 0,
        'Teatro': 0
    };

    eventos.forEach(function (evento) {
        if (evento.tipo in contagem) {
            contagem[evento.tipo]++;
        } else {
            contagem[evento.tipo] = 1;
        }
    });

    return contagem;
}

// Obter os eventos do localStorage
var eventos = obterEventosDoLocalStorage();

// Contar os tipos de eventos
var contagemDeEventos = contarTiposDeEventos(eventos);

// Dados para o gráfico
var labels = Object.keys(contagemDeEventos);
var data = Object.values(contagemDeEventos);

// Criação do gráfico
var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: labels,
        datasets: [{
            label: 'Total Eventos',
            data: data,
            backgroundColor: [
                '#43766C',
                '#6B8F8A',
                '#8CAFA9'
            ],
            hoverOffset: 4
        }]
    }
});