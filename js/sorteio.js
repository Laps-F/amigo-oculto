// =============================================================================
// =============================================================================
// R E G R A S   D O   S O R T E I O
// Funções puras: não mexem na tela nem no banco, então dá para testar sozinhas.

// =============================================================================
// V A L I D A Ç Ã O

// Devolve a lista de problemas dos nomes digitados (vazia quando está tudo certo).
export function validarNomes(nomes, quantidadeEsperada) {
  const erros = [];
  const nomesLimpos = nomes.map(limparNome);

  if (nomesLimpos.length !== quantidadeEsperada) {
    erros.push(`São necessários ${quantidadeEsperada} nomes.`);
  }
  if (nomesLimpos.some((nome) => nome === "")) {
    erros.push("Preencha todos os nomes.");
  }
  if (temRepetidos(nomesLimpos.filter((nome) => nome !== ""))) {
    erros.push("Há nomes repetidos. Use um sobrenome ou apelido para diferenciar.");
  }
  return erros;
}

// Tira espaços sobrando no começo, no fim e no meio de um texto.
export function limparNome(nome) {
  return nome.trim().replace(/\s+/g, " ");
}

// Limpa o nome e cada detalhe de um participante.
export function limparParticipante({ nome, detalhes }) {
  const detalhesLimpos = Object.fromEntries(
    Object.entries(detalhes).map(([chave, valor]) => [chave, limparNome(valor)]),
  );
  return { nome: limparNome(nome), detalhes: detalhesLimpos };
}

// Diz se a lista tem dois nomes iguais, sem diferenciar maiúsculas.
function temRepetidos(nomes) {
  const comparaveis = nomes.map((nome) => nome.toLocaleLowerCase("pt-BR"));
  return new Set(comparaveis).size !== comparaveis.length;
}

// =============================================================================
// S O R T E I O

// Sorteia quem tira quem. Devolve { indiceDeQuemTira: indiceDeQuemFoiTirado }.
// As pessoas são colocadas em uma roda em ordem aleatória e cada uma tira a
// próxima. Assim ninguém tira a si mesma e ninguém fica sem presente.
export function sortearPares(quantidade, aleatorio = Math.random) {
  const roda = embaralhar(criarIndices(quantidade), aleatorio);
  const pares = {};
  roda.forEach((pessoa, posicao) => {
    pares[pessoa] = roda[(posicao + 1) % roda.length];
  });
  return pares;
}

// Cria a lista [0, 1, ..., quantidade - 1].
function criarIndices(quantidade) {
  return Array.from({ length: quantidade }, (_, indice) => indice);
}

// Embaralha uma cópia da lista (Fisher-Yates), sem alterar a original.
function embaralhar(lista, aleatorio) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i -= 1) {
    const j = Math.floor(aleatorio() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}
