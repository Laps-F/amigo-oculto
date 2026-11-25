// =============================================================================
// =============================================================================
// T E L A S
// Único arquivo que mexe no HTML. Não sabe nada de sorteio nem de códigos.
// Nomes digitados entram com textContent, nunca como HTML.

import { TEXTOS } from "./config.js";

const TELAS = ["cadastro", "links", "revelar", "link-invalido"];

// Tempo que o botão mostra "Copiado!" antes de voltar ao texto normal.
const TEMPO_AVISO_COPIA_MS = 1500;

// Atalho para buscar um elemento pelo id.
const elemento = (id) => document.getElementById(id);

// =============================================================================
// N A V E G A Ç Ã O

// Mostra só a tela pedida e esconde as outras.
export function mostrarTela(nomeDaTela) {
  TELAS.forEach((tela) => {
    elemento(`tela-${tela}`).hidden = tela !== nomeDaTela;
  });
}

// =============================================================================
// C A D A S T R O

// Cria um campo de texto para cada participante.
export function montarCamposDeNomes(quantidade) {
  const campos = Array.from({ length: quantidade }, (_, indice) => criarCampo(indice));
  elemento("campos-nomes").replaceChildren(...campos);
}

// Cria o campo "Pessoa N".
function criarCampo(indice) {
  const campo = document.createElement("input");
  campo.type = "text";
  campo.placeholder = `Pessoa ${indice + 1}`;
  campo.setAttribute("aria-label", `Nome da pessoa ${indice + 1}`);
  campo.autocomplete = "off";
  return campo;
}

// Lê o que foi digitado em cada campo.
export function lerNomesDigitados() {
  const campos = elemento("campos-nomes").querySelectorAll("input");
  return Array.from(campos, (campo) => campo.value);
}

// Lista os problemas do formulário embaixo dos campos.
export function mostrarErrosDoFormulario(erros) {
  const itens = erros.map((erro) => {
    const item = document.createElement("li");
    item.textContent = erro;
    return item;
  });
  elemento("erros-formulario").replaceChildren(...itens);
}

// Limpa os campos e os erros para um novo sorteio.
export function limparCadastro() {
  elemento("formulario-nomes").reset();
  mostrarErrosDoFormulario([]);
}

// =============================================================================
// L I N K S

// Mostra uma linha por participante: nome, link e botão de copiar.
export function montarListaDeLinks(links, aoCopiar) {
  const linhas = links.map(({ nome, link }) => criarLinhaDeLink(nome, link, aoCopiar));
  elemento("lista-links").replaceChildren(...linhas);
}

// Cria a linha de um participante.
function criarLinhaDeLink(nome, link, aoCopiar) {
  const linha = document.createElement("div");
  linha.className = "linha-link";

  const rotulo = document.createElement("strong");
  rotulo.textContent = nome;

  const campo = document.createElement("input");
  campo.readOnly = true;
  campo.value = link;
  campo.setAttribute("aria-label", `Link de ${nome}`);

  const botao = document.createElement("button");
  botao.type = "button";
  botao.textContent = TEXTOS.copiarLink;
  botao.addEventListener("click", () => aoCopiar(link, botao, TEXTOS.copiarLink));

  linha.append(rotulo, campo, botao);
  return linha;
}

// Mostra "Copiado!" no botão por um instante e volta ao texto original.
export function avisarCopiaNoBotao(botao, textoOriginal, deuCerto) {
  botao.textContent = deuCerto ? TEXTOS.linkCopiado : TEXTOS.semCopiar;
  setTimeout(() => {
    botao.textContent = textoOriginal;
  }, TEMPO_AVISO_COPIA_MS);
}

// =============================================================================
// P A R T I C I P A N T E

// Troca o visual da página para o tema de Natal de quem abre o link.
export function ativarTemaParticipante() {
  document.body.classList.add("modo-participante");
}

// Preenche a saudação da cena do presente.
export function prepararRevelacao(nomeDeQuemTira) {
  elemento("nome-quem").textContent = nomeDeQuemTira;
}

// =============================================================================
// E V E N T O S

// Liga cada botão fixo da página à função que trata o clique.
export function ligarEventos(acoes) {
  elemento("formulario-nomes").addEventListener("submit", (evento) => {
    evento.preventDefault();
    acoes.aoSortear();
  });
  elemento("botao-copiar-todos").addEventListener("click", (evento) =>
    acoes.aoCopiarTodos(evento.currentTarget),
  );
  elemento("botao-novo-sorteio").addEventListener("click", acoes.aoNovoSorteio);
}
