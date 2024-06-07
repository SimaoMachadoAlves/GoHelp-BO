document.addEventListener("DOMContentLoaded", function () {
  // Passo 1: Recuperar os dados da localStorage
  const eventosJSON = localStorage.getItem("eventos");

  // Passo 2: Parsear o valor JSON para um objeto JavaScript
  const eventos = JSON.parse(eventosJSON);

  // Passo 3: Inicializar um objeto para armazenar os materiais doados combinados
  const livrosDoacao = [];

  // Passo 4: Iterar sobre os eventos e suas inscrições
  eventos.forEach((evento) => {
    evento.inscricoes.forEach((inscricao) => {
      // Verificar se doacoesMateriais existe e é um array antes de usar forEach
      if (Array.isArray(inscricao.doacoesLivros)) {
        inscricao.doacoesLivros.forEach((livro) => {
          // Adicionar o material doado à lista
          livrosDoacao.push(livro);
        });
      }
    });
  });

  console.log(livrosDoacao);

  const tabelaLivrosDoados = document.getElementById("tabela-livros-doados");

  livrosDoacao.forEach((livro, index) => {
    // Cria um novo elemento `tr` para representar uma linha da tabela.
    const linha = document.createElement("tr");
    let aux = livro.estadoLivro;

    const badgeClasse = aux === "naoEntregue" ? "badge-amarelo" : "badge-verde";

    if (aux == "naoEntregue") aux = "Não Entregue";
    else aux = "Entregue";

    // Adiciona células à linha, preenchendo-as com os dados do utilizador e o botão.
    linha.innerHTML = `
          <td>${index + 1}</td>
          <td>${livro.tituloLivro}</td>
          <td>${livro.autorLivro}</td>
          <td>${livro.anoLivro}</td>
          <td><span class="badge ${badgeClasse}">${aux}</span></td>
        `;

    // Anexa a linha à tabela.
    tabelaLivrosDoados.appendChild(linha);
  });
});
