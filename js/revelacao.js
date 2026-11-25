// =============================================================================
// =============================================================================
// R E V E L A Ç Ã O
// Animação da tela de quem abre o link:
//   brilhos no fundo -> laço balança -> presente abre -> confetes -> faixa com o nome
// Os movimentos ficam no CSS (css/revelacao.css). Aqui só decidimos a ordem e
// criamos as peças soltas (brilhos e confetes).

import { ANIMACAO } from "./config.js";

const CORES_CONFETE = ["#e8c35a", "#f8e3a3", "#b3122b", "#ffffff", "#2e8b57", "#d4a017"];

// Atalho para buscar um elemento pelo id.
const elemento = (id) => document.getElementById(id);

// =============================================================================
// S E Q U Ê N C I A

// Roda a animação inteira e termina com o nome sorteado na faixa.
export async function revelarPresente(nomeSorteado) {
  elemento("nome-sorteado").textContent = nomeSorteado;
  criarBrilhos(ANIMACAO.QUANTIDADE_BRILHOS);

  if (prefereMenosMovimento()) {
    mostrarFinalDireto();
    return;
  }

  await esperar(ANIMACAO.PAUSA_INICIAL);
  await balancarPresente();
  abrirPresente();
  await esperar(ANIMACAO.ESPERA_FAIXA);
  elemento("faixa").classList.add("visivel");
  await esperar(ANIMACAO.ESPERA_SEGREDO);
  elemento("segredo").classList.add("visivel");
}

// Liga o balanço do laço e espera ele terminar.
async function balancarPresente() {
  const presente = elemento("presente");
  presente.classList.add("balancando");
  await esperar(ANIMACAO.DURACAO_BALANCO);
  presente.classList.remove("balancando");
}

// Faz a tampa voar e solta os confetes.
function abrirPresente() {
  elemento("presente").classList.add("aberto");
  soltarConfetes(ANIMACAO.QUANTIDADE_CONFETES);
}

// Sem animação: presente aberto, faixa e aviso já visíveis.
function mostrarFinalDireto() {
  elemento("presente").classList.add("aberto");
  elemento("faixa").classList.add("visivel");
  elemento("segredo").classList.add("visivel");
}

// =============================================================================
// B R I L H O S

// Espalha estrelinhas que piscam pelo fundo da página.
function criarBrilhos(quantidade) {
  const brilhos = Array.from({ length: quantidade }, criarBrilho);
  elemento("brilhos").replaceChildren(...brilhos);
}

// Cria um brilho em posição, tamanho e ritmo aleatórios.
function criarBrilho() {
  return criarPeca("brilho", {
    left: `${sortearEntre(0, 100)}%`,
    top: `${sortearEntre(0, 100)}%`,
    "--tamanho": `${sortearEntre(6, 16)}px`,
    "--duracao": `${sortearEntre(2, 4.5)}s`,
    "--atraso": `${sortearEntre(0, 3)}s`,
  });
}

// =============================================================================
// C O N F E T E S

// Solta confetes e estrelinhas saindo do topo da caixa.
function soltarConfetes(quantidade) {
  const pecas = Array.from({ length: quantidade }, (_, indice) => criarConfete(indice));
  elemento("confetes").replaceChildren(...pecas);
}

// Cria uma peça: a cada quatro, uma é estrelinha; as outras são papel colorido.
function criarConfete(indice) {
  const tipo = indice % 4 === 0 ? "estrelinha" : "confete";
  const angulo = sortearEntre(-Math.PI * 0.95, -Math.PI * 0.05);
  const distancia = sortearEntre(90, 230);

  return criarPeca(tipo, {
    "--dx": `${Math.cos(angulo) * distancia}px`,
    "--dy": `${Math.sin(angulo) * distancia}px`,
    "--giro": `${sortearEntre(-720, 720)}deg`,
    "--cor": sortearItem(CORES_CONFETE),
    "--duracao": `${sortearEntre(1.6, 2.6)}s`,
    "--atraso": `${sortearEntre(0, 0.25)}s`,
  });
}

// =============================================================================
// F E R R A M E N T A S

// Cria um <span> com a classe e as variáveis de estilo recebidas.
function criarPeca(classe, estilos) {
  const peca = document.createElement("span");
  peca.className = classe;
  Object.entries(estilos).forEach(([propriedade, valor]) => {
    peca.style.setProperty(propriedade, valor);
  });
  return peca;
}

// Número aleatório entre minimo e maximo.
function sortearEntre(minimo, maximo) {
  return minimo + Math.random() * (maximo - minimo);
}

// Item aleatório de uma lista.
function sortearItem(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

// Pausa por alguns milissegundos.
function esperar(milissegundos) {
  return new Promise((resolver) => setTimeout(resolver, milissegundos));
}

// Diz se a pessoa pediu ao celular para reduzir animações.
function prefereMenosMovimento() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
