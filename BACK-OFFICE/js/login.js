// Função para desabilitar os botões de Voltar e Avançar
function disableBackAndForward() {
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = function() {
        window.history.pushState(null, '', window.location.href);
    };
}

// Chame a função ao carregar a página
window.onload = disableBackAndForward;

function validateLogin() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var errorMessage = document.getElementById('error-message');

    // Check if the login is admin/admin
    if (username === 'admin' && password === 'admin') {
        alert('Login bem-sucedido!');
        window.location.href = 'index.html';
        return;
    }

    // Check localStorage for other users with role "Administrador"
    var colaboradores = JSON.parse(localStorage.getItem('colaboradoresORG')) || [];
    var validUser = colaboradores.find(function(colaborador) {
        return colaborador.emailColaborador === username && colaborador.passwordColaborador === password && colaborador.funcaoColaborador === 'Administrador';
    });

    if (validUser) {
        alert('Login bem-sucedido!');
        window.location.href = 'index.html';
    } else {
        errorMessage.style.display = 'block';
    }
}


document.getElementById('password').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        validateLogin();
    }
});


document.getElementById('username').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        validateLogin();
    }
});
