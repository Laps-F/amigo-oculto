// =============================================================================
// =============================================================================
// C O N F I G U R A Ç Ã O
// Valores fixos do site. Mudar aqui muda o site inteiro.

export const NUMERO_PARTICIPANTES = 6;

// Endereço público do site. Os links de cada pessoa são montados a partir dele.
// Vazio: usa o endereço da própria página (funciona em qualquer hospedagem).
export const URL_DO_SITE = "";

// Tempos da animação do presente, em milissegundos.
// DURACAO_BALANCO precisa bater com a animação "balancar" em css/revelacao.css.
export const ANIMACAO = {
  PAUSA_INICIAL: 700,
  DURACAO_BALANCO: 2000,
  ESPERA_FAIXA: 350,
  ESPERA_SEGREDO: 900,
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
