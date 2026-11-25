// =============================================================================
// =============================================================================
// P O N T O   D E   E N T R A D A
// A página tem dois modos, decididos pelo endereço:
//   sem #codigo  -> modo organizadora: cadastra nomes, sorteia, gera links
//   com #codigo  -> modo participante: mostra quem a pessoa tirou

import { NUMERO_PARTICIPANTES, TEXTOS, URL_DO_SITE } from "./config.js";
import { decodificarResultado } from "./codificacao.js";
import { juntarLinksEmTexto, lerCodigoDoEndereco, montarLinks } from "./links.js";
import { revelarPresente } from "./revelacao.js";
import { limparParticipante, sortearPares, validarNomes } from "./sorteio.js";
import * as telas from "./telas.js";

// Links do último sorteio, guardados só na memória desta página.
let linksGerados = [];

// =============================================================================
// I N I C I A L I Z A Ç Ã O

// Liga os botões e abre o modo certo para o endereço atual.
function iniciar() {
  telas.ligarEventos({
    aoSortear: tratarSortear,
    aoCopiarTodos: tratarCopiarTodos,
    aoNovoSorteio: tratarNovoSorteio,
  });

  const codigo = lerCodigoDoEndereco(location.hash);
  if (codigo === "") {
    iniciarModoOrganizadora();
  } else {
    iniciarModoParticipante(codigo);
  }
}

// =============================================================================
// M O D O   O R G A N I Z A D O R A

// Mostra o formulário de cadastro dos participantes.
function iniciarModoOrganizadora() {
  telas.montarCamposDeParticipantes(NUMERO_PARTICIPANTES);
  telas.mostrarTela("cadastro");
}

// Valida os nomes, sorteia e mostra os links, sem mostrar o resultado.
function tratarSortear() {
  const participantes = telas.lerParticipantesDigitados().map(limparParticipante);
  const nomes = participantes.map((pessoa) => pessoa.nome);
  const erros = validarNomes(nomes, NUMERO_PARTICIPANTES);
  telas.mostrarErrosDoFormulario(erros);
  if (erros.length > 0) {
    return;
  }

  const pares = sortearPares(participantes.length);
  linksGerados = montarLinks(participantes, pares, enderecoBase());
  telas.montarListaDeLinks(linksGerados, copiarComAviso);
  telas.mostrarTela("links");
}

// Copia todos os links de uma vez, um por linha.
function tratarCopiarTodos(botao) {
  copiarComAviso(juntarLinksEmTexto(linksGerados), botao, TEXTOS.copiarTodos);
}

// Descarta os links atuais e volta para o cadastro.
function tratarNovoSorteio() {
  linksGerados = [];
  telas.limparCadastro();
  telas.mostrarTela("cadastro");
}

// Endereço usado nos links: o da configuração ou, se vazio, o da página atual.
function enderecoBase() {
  return URL_DO_SITE || location.href.split("#")[0];
}

// =============================================================================
// M O D O   P A R T I C I P A N T E

// Lê o resultado do link e abre a cena do presente, sem nenhum clique.
function iniciarModoParticipante(codigo) {
  const resultado = decodificarResultado(codigo);
  if (!resultado) {
    telas.mostrarTela("link-invalido");
    return;
  }
  telas.ativarTemaParticipante();
  telas.prepararRevelacao(resultado.nomeDeQuemTira);
  telas.mostrarTela("revelar");
  revelarPresente(resultado.pessoaSorteada);
}

// =============================================================================
// F E R R A M E N T A S

// Copia um texto e mostra no botão se deu certo.
async function copiarComAviso(texto, botao, textoOriginalDoBotao) {
  const deuCerto = await copiarTexto(texto);
  telas.avisarCopiaNoBotao(botao, textoOriginalDoBotao, deuCerto);
}

// Tenta copiar para a área de transferência. Devolve true se conseguiu.
async function copiarTexto(texto) {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    return false;
  }
}

// =============================================================================
// =============================================================================
// E X E C U Ç Ã O

iniciar();
