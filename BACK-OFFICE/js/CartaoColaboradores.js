// AtualizarCartaoColaboradores.js

document.addEventListener('DOMContentLoaded', function () {
    atualizarCartaoColaboradores();
  
    function atualizarCartaoColaboradores() {
      const colaboradores = JSON.parse(localStorage.getItem('colaboradoresORG')) || [];
  
      // Inicializa os contadores
      const funcaoContagem = {
        'Administrador': 0,
        'Colaborador': 0,
        'Fotógrafo': 0,
        'Motorista': 0
      };
  
      // Contabiliza colaboradores em cada função
      colaboradores.forEach(colaborador => {
        const funcao = colaborador.funcaoColaborador;
        if (funcao in funcaoContagem) {
          funcaoContagem[funcao]++;
        }
      });
  
      // Atualiza o conteúdo do cartão com os números atualizados
      const cartaoConteudo = `
        Administradores: ${funcaoContagem['Administrador']}<br>
        Colaboradores: ${funcaoContagem['Colaborador']}<br>
        Fotógrafos: ${funcaoContagem['Fotógrafo']}<br>
        Motoristas: ${funcaoContagem['Motorista']}
      `;
  
      // Identifica todos os cartões que possuem a classe `card-colaboradores`
      document.querySelectorAll('.card-colaboradores .card-body').forEach(body => {
        body.innerHTML = cartaoConteudo;
      });
    }
  });
  