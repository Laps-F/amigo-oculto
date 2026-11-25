# Nosso fim de ano: amigo oculto

Site estático para sortear o amigo oculto sem que a organizadora saiba o resultado.

## Como usar

1. Abra o site, digite os nomes de todas as pessoas (inclusive o seu) e, se quiser, as medidas e cores de cada uma. Clique em **Sortear e gerar links**.
2. O site mostra um link para cada pessoa, sem mostrar quem tirou quem.
3. Mande cada link só para a pessoa do nome.
4. Quem abre o link vê um presente cujo laço balança por 2 segundos. Depois ele se abre, solta confetes e mostra uma faixa com o nome sorteado. Não precisa tocar em nada. Depois a página se reorganiza na mesma tela: tudo encolhe, o nome sorteado fica grande e aparecem as medidas e cores da pessoa (só as que foram preenchidas). Feito para celular.

Nada é salvo em servidor: o resultado de cada pessoa vai embaralhado no fim do próprio link (`#codigo`).
Copie todos os links antes de sair da página, porque eles somem se ela for recarregada.

O embaralhamento evita que a organizadora descubra o resultado sem querer. Ele não é criptografia:
quem abrir o link de outra pessoa vê o resultado dela.

## Arquivos

| Arquivo | O que faz |
|---|---|
| `index.html` | Estrutura das telas |
| `css/estilo.css` | Estilo básico da tela da organizadora |
| `css/revelacao.css` | Cena do presente: fundo, laço, tampa, faixa, confetes e brilhos |
| `js/config.js` | Quantidade de pessoas, endereço do site e textos |
| `js/sorteio.js` | Valida os nomes e sorteia em roda, para ninguém tirar a si mesma |
| `js/codificacao.js` | Embaralha e desembaralha o resultado que vai no link |
| `js/links.js` | Monta o link de cada pessoa e lê o código do endereço |
| `js/telas.js` | Desenha as telas e lê o formulário |
| `js/revelacao.js` | Ordem da animação do presente e criação dos confetes e brilhos |
| `js/main.js` | Ponto de entrada: sem código no endereço abre a tela da organizadora, com código abre a da participante |

## Publicar no GitHub Pages

Em **Settings > Pages**, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`.
O site fica em `https://<usuario>.github.io/<repositorio>/`.

## Rodar localmente

Os arquivos JS são módulos, então o navegador não os carrega direto do disco. Rode um servidor simples:

```
python -m http.server
```

e abra `http://localhost:8000`.
