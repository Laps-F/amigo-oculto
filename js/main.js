// =============================================================================
// =============================================================================
// P O N T O   D E   E N T R A D A
// A página tem dois modos, decididos pelo endereço:
//   sem #codigo  -> modo organizadora: cadastra nomes, sorteia, gera links
//   com #codigo  -> modo participante: mostra quem a pessoa tirou

import { NUMERO_PARTICIPANTES, SEGUNDOS_CONTAGEM, TEXTOS, URL_DO_SITE } from "./config.js";
import { decodificarResultado } from "./codificacao.js";
import { juntarLinksEmTexto, lerCodigoDoEndereco, montarLinks } from "./links.js";
import { limparNome, sortearPares, validarNomes } from "./sorteio.js";
import * as telas from "./telas.js";

// Links do último sorteio, guardados só na memória desta página.
let linksGerados = [];

const UM_SEGUNDO_MS = 1000;

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

// Mostra o formulário de cadastro dos nomes.
function iniciarModoOrganizadora() {
  telas.montarCamposDeNomes(NUMERO_PARTICIPANTES);
  telas.mostrarTela("cadastro");
}

// Valida os nomes, sorteia e mostra os links, sem mostrar o resultado.
function tratarSortear() {
  const nomes = telas.lerNomesDigitados().map(limparNome);
  const erros = validarNomes(nomes, NUMERO_PARTICIPANTES);
  telas.mostrarErrosDoFormulario(erros);
  if (erros.length > 0) {
    return;
  }

  const pares = sortearPares(nomes.length);
  linksGerados = montarLinks(nomes, pares, enderecoBase());
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

// Lê o resultado do link, faz a contagem e mostra o nome sorteado, sem nenhum clique.
function iniciarModoParticipante(codigo) {
  const resultado = decodificarResultado(codigo);
  if (!resultado) {
    telas.mostrarTela("link-invalido");
    return;
  }
  telas.prepararRevelacao(resultado.nomeDeQuemTira);
  telas.mostrarTela("revelar");
  fazerContagemRegressiva(SEGUNDOS_CONTAGEM, telas.mostrarNumeroDaContagem, () =>
    mostrarResultado(resultado.nomeSorteado),
  );
}

// Troca a contagem pelo nome sorteado.
function mostrarResultado(nomeSorteado) {
  telas.prepararResultado(nomeSorteado);
  telas.mostrarTela("resultado");
}

// Chama aCadaSegundo(3), (2), (1), um por segundo, e depois aoTerminar().
function fazerContagemRegressiva(segundos, aCadaSegundo, aoTerminar) {
  if (segundos <= 0) {
    aoTerminar();
    return;
  }
  aCadaSegundo(segundos);
  setTimeout(
    () => fazerContagemRegressiva(segundos - 1, aCadaSegundo, aoTerminar),
    UM_SEGUNDO_MS,
  );
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
