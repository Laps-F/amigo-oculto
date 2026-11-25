// =============================================================================
// =============================================================================
// C O D I F I C A Ç Ã O
// Transforma "quem tira quem" (com as medidas e cores da pessoa sorteada) em um
// código que não dá para ler de olho, e volta.
// O código usa só letras, números, "-" e "_", que podem ir no fim do link.
//
// Importante: isto é embaralhamento, não criptografia. Serve para a
// organizadora não descobrir o resultado sem querer, olhando o link.
//
// Conteúdo do código, em ordem:
//   [nome de quem tira, nome sorteado, ...detalhes na ordem de CAMPOS_DETALHES]

import { CAMPOS_DETALHES, TAMANHO_SAL } from "./config.js";

// =============================================================================
// C O D I F I C A R

// Gera o código de uma pessoa a partir do nome dela e da pessoa que ela tirou.
export function codificarResultado(nomeDeQuemTira, pessoaSorteada, aleatorio = Math.random) {
  const lista = [nomeDeQuemTira, pessoaSorteada.nome, ...detalhesEmOrdem(pessoaSorteada.detalhes)];
  const conteudo = new TextEncoder().encode(JSON.stringify(lista));
  const sal = gerarSal(aleatorio);
  const embaralhado = misturarComSal(conteudo, sal);
  return paraBase64Url(juntarBytes(sal, embaralhado));
}

// Põe os detalhes na ordem fixa de CAMPOS_DETALHES (vazio quando faltar).
function detalhesEmOrdem(detalhes = {}) {
  return CAMPOS_DETALHES.map(({ chave }) => detalhes[chave] ?? "");
}

// Cria bytes aleatórios para deixar cada código diferente.
function gerarSal(aleatorio) {
  return Uint8Array.from({ length: TAMANHO_SAL }, () => Math.floor(aleatorio() * 256));
}

// =============================================================================
// D E C O D I F I C A R

// Recupera { nomeDeQuemTira, pessoaSorteada: { nome, detalhes } }, ou null se inválido.
export function decodificarResultado(codigo) {
  const bytes = deBase64Url(codigo);
  if (!bytes || bytes.length <= TAMANHO_SAL) {
    return null;
  }
  const sal = bytes.slice(0, TAMANHO_SAL);
  const conteudo = misturarComSal(bytes.slice(TAMANHO_SAL), sal);
  return lerConteudo(conteudo);
}

// Converte os bytes de volta para os nomes e detalhes, conferindo o formato.
function lerConteudo(conteudo) {
  const lista = lerListaDeTextos(conteudo);
  if (!lista || lista.length < 2) {
    return null;
  }
  const [nomeDeQuemTira, nomeSorteado, ...valores] = lista;
  return {
    nomeDeQuemTira,
    pessoaSorteada: { nome: nomeSorteado, detalhes: detalhesDaLista(valores) },
  };
}

// Lê os bytes como uma lista JSON de textos, ou null se não for isso.
function lerListaDeTextos(conteudo) {
  try {
    const texto = new TextDecoder("utf-8", { fatal: true }).decode(conteudo);
    const lista = JSON.parse(texto);
    const ehListaDeTextos = Array.isArray(lista) && lista.every((item) => typeof item === "string");
    return ehListaDeTextos ? lista : null;
  } catch {
    return null;
  }
}

// Monta { chave: valor } a partir dos valores na ordem de CAMPOS_DETALHES.
function detalhesDaLista(valores) {
  return Object.fromEntries(CAMPOS_DETALHES.map(({ chave }, posicao) => [chave, valores[posicao] ?? ""]));
}

// =============================================================================
// F E R R A M E N T A S

// Mistura cada byte com o sal (XOR). Aplicar duas vezes volta ao original.
function misturarComSal(bytes, sal) {
  return bytes.map((byte, posicao) => byte ^ sal[posicao % sal.length]);
}

// Junta duas listas de bytes em uma.
function juntarBytes(primeira, segunda) {
  const juntos = new Uint8Array(primeira.length + segunda.length);
  juntos.set(primeira);
  juntos.set(segunda, primeira.length);
  return juntos;
}

// Bytes -> texto base64 próprio para link (sem "+", "/" e "=").
function paraBase64Url(bytes) {
  const binario = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
  return btoa(binario).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Texto base64 de link -> bytes, ou null se o texto não for válido.
function deBase64Url(texto) {
  if (!/^[A-Za-z0-9_-]+$/.test(texto)) {
    return null;
  }
  try {
    const binario = atob(texto.replace(/-/g, "+").replace(/_/g, "/"));
    return Uint8Array.from(binario, (letra) => letra.charCodeAt(0));
  } catch {
    return null;
  }
}
