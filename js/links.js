// =============================================================================
// =============================================================================
// L I N K S
// Monta o link de cada participante e lê o código do link aberto.

import { codificarResultado } from "./codificacao.js";

// Gera [{ nome, link }] para cada participante, a partir do sorteio.
export function montarLinks(participantes, pares, enderecoBase) {
  return participantes.map((nome, indice) => {
    const nomeSorteado = participantes[pares[indice]];
    const codigo = codificarResultado(nome, nomeSorteado);
    return { nome, link: `${enderecoBase}#${codigo}` };
  });
}

// Lê o código que vem depois do # no endereço aberto (texto vazio se não houver).
export function lerCodigoDoEndereco(hash) {
  return hash.replace(/^#/, "").toLowerCase();
}

// Junta os links em um texto só, um por linha, para colar onde quiser.
export function juntarLinksEmTexto(links) {
  return links.map(({ nome, link }) => `${nome}: ${link}`).join("\n");
}
