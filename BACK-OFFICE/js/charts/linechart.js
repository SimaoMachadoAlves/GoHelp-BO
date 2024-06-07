// Função para contar o número de eventos por mês
function contarEventosPorMes(eventos) {
    const contagemMensal = {
        Janeiro: 0,
        Fevereiro: 0,
        Março: 0,
        Abril: 0,
        Maio: 0,
        Junho: 0,
        Julho: 0,
        Agosto: 0,
        Setembro: 0,
        Outubro: 0,
        Novembro: 0,
        Dezembro: 0
    };

    eventos.forEach(evento => {
        const mes = new Date(evento.dataEvento).toLocaleString('pt-PT', { month: 'long' });
        const mesFormatado = mes.charAt(0).toUpperCase() + mes.slice(1);
        contagemMensal[mesFormatado]++;
    });

    return contagemMensal;
}

// Recuperar eventos do local storage
const eventosLocalStorage = JSON.parse(localStorage.getItem('eventos')) || [];

// Contar eventos por mês
const contagemMensal = contarEventosPorMes(eventosLocalStorage);

// Arrays com os nomes dos meses em ordem
const mesesOrdem = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

// Filtrar meses e valores onde o número de eventos é maior que zero
const meses = [];
const valores = [];
let inicio = false;
let fim = false;

for (let i = 0; i < mesesOrdem.length; i++) {
    const mes = mesesOrdem[i];
    const valor = contagemMensal[mes];

    if (valor > 0) {
        if (!inicio) {
            inicio = i > 0 ? i - 1 : 0;  // Pega o mês anterior se possível
        }
        fim = i < mesesOrdem.length - 1 ? i + 1 : i;  // Pega o mês seguinte se possível
    }
}

for (let i = inicio; i <= fim; i++) {
    const mes = mesesOrdem[i];
    meses.push(mes);
    valores.push(contagemMensal[mes]);
}

// Atualizar os dados do gráfico
var ctx = document.getElementById('myChart2').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: meses,
        datasets: [{
            label: 'Número de Eventos por Mês',
            backgroundColor: 'rgba(67, 118, 108, 0.5)', // Cor com transparência
            borderColor: '#43766C', // Cor sólida
            pointBackgroundColor: '#43766C', // Cor sólida dos pontos
            pointBorderColor: '#2C4D46', // Cor um pouco mais escura para a borda dos pontos
            pointHoverBackgroundColor: '#2C4D46', // Cor dos pontos quando o mouse estiver sobre eles
            pointHoverBorderColor: '#43766C', // Cor da borda dos pontos quando o mouse estiver sobre eles
            data: valores
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1 // Garantir que os valores sejam sempre inteiros
                }
            }
        }
    }
});
