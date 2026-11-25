// =============================================================================
// =============================================================================
// T E L A S
// Único arquivo que mexe no HTML. Não sabe nada de sorteio nem de códigos.
// Nomes digitados entram com textContent, nunca como HTML.

import { CAMPOS_DETALHES, TEXTOS } from "./config.js";

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

// Cria um bloco por participante: nome e, embaixo, as medidas e cores.
export function montarCamposDeParticipantes(quantidade) {
  const blocos = Array.from({ length: quantidade }, (_, indice) => criarBlocoDePessoa(indice));
  elemento("campos-nomes").replaceChildren(...blocos);
}

// Cria o bloco "Pessoa N" com o campo de nome e os campos de detalhes.
function criarBlocoDePessoa(indice) {
  const bloco = document.createElement("fieldset");
  bloco.className = "pessoa";

  const titulo = document.createElement("legend");
  titulo.textContent = `Pessoa ${indice + 1}`;

  const campoNome = criarCampoComRotulo("Nome", "Ex.: Maria");
  campoNome.input.classList.add("campo-nome");

  const camposDetalhes = CAMPOS_DETALHES.map(({ chave, rotuloCadastro, exemplo }) => {
    const campo = criarCampoComRotulo(rotuloCadastro, `Ex.: ${exemplo}`);
    campo.input.dataset.chave = chave;
    return campo;
  });

  const rotulos = [campoNome, ...camposDetalhes].map((campo) => campo.rotulo);
  bloco.append(titulo, ...rotulos);
  return bloco;
}

// Cria um campo de texto com o rótulo fixo em cima, para não se perder ao preencher.
// Devolve { rotulo, input }: o rótulo vai para a tela, o input recebe as marcações.
function criarCampoComRotulo(textoDoRotulo, dica) {
  const rotulo = document.createElement("label");
  const texto = document.createElement("span");
  texto.textContent = textoDoRotulo;

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = dica;
  input.autocomplete = "off";

  rotulo.append(texto, input);
  return { rotulo, input };
}

// Lê cada bloco e devolve [{ nome, detalhes: { blusa, calca, ... } }].
export function lerParticipantesDigitados() {
  const blocos = elemento("campos-nomes").querySelectorAll(".pessoa");
  return Array.from(blocos, lerBlocoDePessoa);
}

// Lê o nome e os detalhes de um bloco.
function lerBlocoDePessoa(bloco) {
  const detalhes = {};
  bloco.querySelectorAll("[data-chave]").forEach((campo) => {
    detalhes[campo.dataset.chave] = campo.value;
  });
  return { nome: bloco.querySelector(".campo-nome").value, detalhes };
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
  document.documentElement.classList.add("modo-participante");
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
