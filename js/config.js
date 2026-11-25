// =============================================================================
// =============================================================================
// C O N F I G U R A Ç Ã O
// Valores fixos do site. Mudar aqui muda o site inteiro.

export const NUMERO_PARTICIPANTES = 6;

// Endereço público do site. Os links de cada pessoa são montados a partir dele.
// Vazio: usa o endereço da própria página (funciona em qualquer hospedagem).
export const URL_DO_SITE = "";

// Informações de cada pessoa que aparecem para quem tirar ela.
// rotulo: texto curto no cartão de quem tirou; rotuloCadastro: texto no formulário.
// largura "inteira": ocupa a linha toda no cartão; sem ela, divide a linha em três.
// A ordem aqui é a ordem na tela e no código do link: para não quebrar links
// já enviados, só acrescente campos novos no fim.
export const CAMPOS_DETALHES = [
  { chave: "blusa", rotulo: "Blusa", rotuloCadastro: "Tamanho de blusa", exemplo: "M" },
  { chave: "calca", rotulo: "Calça", rotuloCadastro: "Tamanho de calça", exemplo: "40" },
  { chave: "sapato", rotulo: "Sapato", rotuloCadastro: "Numeração de sapato", exemplo: "37" },
  {
    chave: "coresPreferidas",
    rotulo: "Cores que gosta",
    rotuloCadastro: "Preferência de cores",
    exemplo: "azul, verde",
    largura: "inteira",
  },
  {
    chave: "coresEvitar",
    rotulo: "Cores que não gosta",
    rotuloCadastro: "Cores que não gosta",
    exemplo: "laranja",
    largura: "inteira",
  },
];

// Tempos da animação do presente, em milissegundos.
// DURACAO_BALANCO precisa bater com a animação "balancar" em css/revelacao.css,
// e DURACAO_REORGANIZAR com as transições do PASSO 4 (0,8 s) mais uma folga.
export const ANIMACAO = {
  PAUSA_INICIAL: 700,
  DURACAO_BALANCO: 2000,
  ESPERA_FAIXA: 350,
  ESPERA_REORGANIZAR: 1300,
  DURACAO_REORGANIZAR: 850,
  ESPERA_SEGREDO: 500,
  ESPERA_DETALHES: 400,
  QUANTIDADE_CONFETES: 90,
  QUANTIDADE_BRILHOS: 28,
};

// Tamanho do "sal": bytes aleatórios que deixam cada link diferente dos outros.
export const TAMANHO_SAL = 4;

export const TEXTOS = {
  linkCopiado: "Copiado!",
  copiarLink: "Copiar link",
  copiarTodos: "Copiar todos os links",
  todosCopiados: "Todos copiados!",
  semCopiar: "Não deu para copiar. Selecione o link e copie à mão.",
};
