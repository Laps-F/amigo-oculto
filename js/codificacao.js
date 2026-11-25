// =============================================================================
// =============================================================================
// C O D I F I C A Ç Ã O
// Transforma "quem tira quem" em um código que não dá para ler de olho, e volta.
// O código usa só 0-9 e a-f, que é o que pode ir no fim do link (#codigo).
//
// Importante: isto é embaralhamento, não criptografia. Serve para a
// organizadora não descobrir o resultado sem querer, olhando o link.

import { TAMANHO_SAL } from "./config.js";

// =============================================================================
// C O D I F I C A R

// Gera o código de uma pessoa a partir do nome dela e do nome que ela tirou.
export function codificarResultado(nomeDeQuemTira, nomeSorteado, aleatorio = Math.random) {
  const conteudo = new TextEncoder().encode(JSON.stringify([nomeDeQuemTira, nomeSorteado]));
  const sal = gerarSal(aleatorio);
  const embaralhado = misturarComSal(conteudo, sal);
  return paraHexadecimal(sal) + paraHexadecimal(embaralhado);
}

// Cria bytes aleatórios para deixar cada código diferente.
function gerarSal(aleatorio) {
  return Uint8Array.from({ length: TAMANHO_SAL }, () => Math.floor(aleatorio() * 256));
}

// =============================================================================
// D E C O D I F I C A R

// Recupera { nomeDeQuemTira, nomeSorteado } do código, ou null se ele for inválido.
export function decodificarResultado(codigo) {
  const bytes = deHexadecimal(codigo);
  if (!bytes || bytes.length <= TAMANHO_SAL) {
    return null;
  }
  const sal = bytes.slice(0, TAMANHO_SAL);
  const conteudo = misturarComSal(bytes.slice(TAMANHO_SAL), sal);
  return lerConteudo(conteudo);
}

// Converte os bytes de volta para os dois nomes, conferindo o formato.
function lerConteudo(conteudo) {
  try {
    const texto = new TextDecoder("utf-8", { fatal: true }).decode(conteudo);
    const [nomeDeQuemTira, nomeSorteado] = JSON.parse(texto);
    const formatoValido = typeof nomeDeQuemTira === "string" && typeof nomeSorteado === "string";
    return formatoValido ? { nomeDeQuemTira, nomeSorteado } : null;
  } catch {
    return null;
  }
}

// =============================================================================
// F E R R A M E N T A S

// Mistura cada byte com o sal (XOR). Aplicar duas vezes volta ao original.
function misturarComSal(bytes, sal) {
  return bytes.map((byte, posicao) => byte ^ sal[posicao % sal.length]);
}

// Bytes -> texto em hexadecimal ("0a3f...").
function paraHexadecimal(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

// Texto em hexadecimal -> bytes, ou null se o texto não for hexadecimal.
function deHexadecimal(texto) {
  if (!/^([0-9a-f]{2})+$/.test(texto)) {
    return null;
  }
  const pares = texto.match(/../g);
  return Uint8Array.from(pares, (par) => parseInt(par, 16));
}
