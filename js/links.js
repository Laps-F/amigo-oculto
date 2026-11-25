// =============================================================================
// =============================================================================
// L I N K S
// Monta o link de cada participante e lê o código do link aberto.

import { codificarResultado } from "./codificacao.js";

// Gera [{ nome, link }] para cada participante, a partir do sorteio.
// participantes: [{ nome, detalhes }]; pares: { indiceDeQuemTira: indiceSorteado }.
export function montarLinks(participantes, pares, enderecoBase) {
  return participantes.map((pessoa, indice) => {
    const pessoaSorteada = participantes[pares[indice]];
    const codigo = codificarResultado(pessoa.nome, pessoaSorteada);
    return { nome: pessoa.nome, link: `${enderecoBase}#${codigo}` };
  });
}

// Lê o código que vem depois do # no endereço aberto (texto vazio se não houver).
export function lerCodigoDoEndereco(hash) {
  return hash.replace(/^#/, "").trim();
}

// Junta os links em um texto só, um por linha, para colar onde quiser.
export function juntarLinksEmTexto(links) {
  return links.map(({ nome, link }) => `${nome}: ${link}`).join("\n");
}
