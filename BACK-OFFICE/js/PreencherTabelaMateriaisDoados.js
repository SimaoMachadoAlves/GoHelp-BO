document.addEventListener("DOMContentLoaded", function () {
  // Passo 1: Recuperar os dados da localStorage
  const eventosJSON = localStorage.getItem("eventos");

  // Passo 2: Parsear o valor JSON para um objeto JavaScript
  const eventos = JSON.parse(eventosJSON);

  // Passo 3: Inicializar um objeto para armazenar os materiais doados combinados
  const materiaisDoacaoCombinados = {};

  // Passo 4: Iterar sobre os eventos e suas inscrições
  eventos.forEach((evento) => {
    evento.inscricoes.forEach((inscricao) => {
      // Verificar se doacoesMateriais existe e é um array antes de usar forEach
      if (Array.isArray(inscricao.doacoesMateriais)) {
        inscricao.doacoesMateriais.forEach((material) => {
          // Se a descrição do material já existe, somar a quantidade
          if (materiaisDoacaoCombinados[material.descricaoMaterial]) {
            materiaisDoacaoCombinados[
              material.descricaoMaterial
            ].quantidadeMaterial += material.quantidadeMaterial;
          } else {
            // Caso contrário, adicionar o material como novo
            materiaisDoacaoCombinados[material.descricaoMaterial] = {
              ...material,
            };
          }
        });
      }
    });
  });

  // Agora materiaisDoacaoCombinados contém todos os materiais doados combinados por descrição
  const materiaisDoacao = Object.values(materiaisDoacaoCombinados);
  console.log(materiaisDoacao);

  const tabelaMateriaisDoados = document.getElementById(
    "tabela-materiais-doados"
  );

  materiaisDoacao.forEach((material, index) => {
    // Cria um novo elemento `tr` para representar uma linha da tabela.
    const linha = document.createElement("tr");
    let aux = material.estadoMaterialDoacao;

    const badgeClasse = aux === "naoEntregue" ? "badge-amarelo" : "badge-verde";

    if (aux == "naoEntregue") aux = "Não Entregue";
    else aux = "Entregue";

    // Adiciona células à linha, preenchendo-as com os dados do utilizador e o botão.
    linha.innerHTML = `
        <td>${index + 1}</td>
        <td>${material.descricaoMaterial}</td>
        <td>${material.tipoMaterial}</td>
        <td>${material.quantidadeMaterial}</td>
        <td><span class="badge ${badgeClasse}">${aux}</span></td>
      `;

    // Anexa a linha à tabela.
    tabelaMateriaisDoados.appendChild(linha);
  });
});
