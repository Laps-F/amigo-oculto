// =============================================================================
// =============================================================================
// R E V E L A Ç Ã O
// Animação da tela de quem abre o link:
//   brilhos no fundo -> laço balança -> presente abre -> confetes -> faixa com o nome
//   -> página se reorganiza (tudo encolhe, o nome cresce)
//   -> aviso de segredo -> cartão com medidas e cores da pessoa sorteada
// Tudo acontece na mesma tela: nada abre, nada redireciona.
// Os movimentos ficam no CSS (css/revelacao.css). Aqui só decidimos a ordem e
// criamos as peças soltas (brilhos e confetes).

import { ANIMACAO, CAMPOS_DETALHES } from "./config.js";

// Espaço livre acima da faixa depois que a página se reorganiza.
const FOLGA_PALCO_PX = 8;

const CORES_CONFETE = ["#e8c35a", "#f8e3a3", "#b3122b", "#ffffff", "#2e8b57", "#d4a017"];

// Atalho para buscar um elemento pelo id.
const elemento = (id) => document.getElementById(id);

// =============================================================================
// S E Q U Ê N C I A

// Roda a animação inteira e termina com o nome e os detalhes da pessoa sorteada.
// pessoaSorteada: { nome, detalhes: { blusa, calca, ... } }
export async function revelarPresente(pessoaSorteada) {
  elemento("nome-sorteado").textContent = pessoaSorteada.nome;
  const temDetalhes = preencherDetalhes(pessoaSorteada.detalhes);
  criarBrilhos(ANIMACAO.QUANTIDADE_BRILHOS);

  if (prefereMenosMovimento()) {
    mostrarFinalDireto(temDetalhes);
    return;
  }

  await esperar(ANIMACAO.PAUSA_INICIAL);
  await balancarPresente();
  abrirPresente();
  await esperar(ANIMACAO.ESPERA_FAIXA);
  elemento("faixa").classList.add("visivel");
  await esperar(ANIMACAO.ESPERA_REORGANIZAR);
  reorganizarPagina();
  await esperar(ANIMACAO.ESPERA_SEGREDO);
  elemento("segredo").classList.add("visivel");
  await esperar(ANIMACAO.ESPERA_DETALHES);
  mostrarDetalhes(temDetalhes);
}

// Encolhe título, saudação e presente e dá destaque ao nome (ver PASSO 4 no CSS).
// Depois que o nome cresce, o palco se ajusta à altura real da faixa, que muda
// com o tamanho do nome (uma ou duas linhas) e com a largura do celular.
async function reorganizarPagina() {
  document.documentElement.classList.add("revelado");
  await esperar(ANIMACAO.DURACAO_REORGANIZAR);
  ajustarAlturaDoPalco();
  window.addEventListener("resize", ajustarAlturaDoPalco);
}

// Deixa o palco com a altura exata para a faixa caber sem espaço sobrando.
function ajustarAlturaDoPalco() {
  const faixa = elemento("faixa");
  const distanciaDoChao = parseFloat(getComputedStyle(faixa).bottom);
  const altura = faixa.offsetHeight + distanciaDoChao + FOLGA_PALCO_PX;
  elemento("palco").style.setProperty("--altura-palco", `${altura}px`);
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

// Sem animação: página já reorganizada, com o nome e os detalhes visíveis.
function mostrarFinalDireto(temDetalhes) {
  reorganizarPagina();
  elemento("presente").classList.add("aberto");
  elemento("faixa").classList.add("visivel");
  elemento("segredo").classList.add("visivel");
  mostrarDetalhes(temDetalhes);
}

// =============================================================================
// D E T A L H E S   D A   P E S S O A   S O R T E A D A

// Monta a lista de medidas e cores. Devolve false se nenhuma foi preenchida.
function preencherDetalhes(detalhes) {
  const preenchidos = CAMPOS_DETALHES.filter(({ chave }) => detalhes[chave]);
  const linhas = preenchidos.map(({ chave, rotulo }) => criarLinhaDeDetalhe(rotulo, detalhes[chave]));
  elemento("lista-detalhes").replaceChildren(...linhas);
  return preenchidos.length > 0;
}

// Cria um bloco com o rótulo em cima e o valor embaixo.
function criarLinhaDeDetalhe(rotulo, valor) {
  const bloco = document.createElement("div");
  bloco.className = "detalhe";
  const termo = document.createElement("dt");
  termo.textContent = rotulo;
  const descricao = document.createElement("dd");
  descricao.textContent = valor;
  bloco.append(termo, descricao);
  return bloco;
}

// Mostra o cartão de detalhes, só se houver algo para mostrar.
function mostrarDetalhes(temDetalhes) {
  const cartao = elemento("detalhes");
  cartao.hidden = !temDetalhes;
  requestAnimationFrame(() => cartao.classList.add("visivel"));
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

  const peca = criarPeca(tipo, {
    "--dx": `${Math.cos(angulo) * distancia}px`,
    "--dy": `${Math.sin(angulo) * distancia}px`,
    "--giro": `${sortearEntre(-720, 720)}deg`,
    "--cor": sortearItem(CORES_CONFETE),
    "--duracao": `${sortearEntre(1.6, 2.6)}s`,
    "--atraso": `${sortearEntre(0, 0.25)}s`,
  });
  // Depois de cair, a peça sai da página para não ficar escondida fora da tela.
  peca.addEventListener("animationend", () => peca.remove());
  return peca;
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
