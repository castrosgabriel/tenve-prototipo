# Tenvê · protótipo navegável

Aplicação React que reproduz o fluxo do app Tenvê a partir do arquivo de design
(página "App · Telas"). Estado em memória — nada é persistido, é só para clicar
e testar.

## Rodando

```bash
npm install
npm run dev
```

Abre em http://localhost:5274. Em telas largas aparece a moldura de celular;
abaixo de 720 px o app ocupa a tela inteira (como no celular de verdade).

## Publicar

```bash
npm run build:single
```

Gera dois arquivos em `dist/`:

- **`tenve.html`** — o protótipo inteiro em um arquivo só (~600 KB). JS, CSS,
  ícones e imagens vão embutidos como data URI; a única coisa que ele busca na
  rede é a fonte Geist do Google Fonts (sem ela, cai no fallback do sistema e
  continua funcionando). Abre com clique duplo, dá para mandar por e-mail, ou
  jogar em qualquer hospedagem estática.
- **`artifact.html`** — o mesmo conteúdo sem `<html>/<head>/<body>`, para
  publicar em lugares que adicionam esse invólucro por fora.

Para virar link público sem configurar nada:

```bash
npx surge dist
```

Também serve arrastar a pasta `dist` no app.netlify.com/drop.

### Abrir sem cara de navegador

Hospedando a pasta `dist`, o protótipo vira um app de tela cheia: no iPhone,
Safari → Compartilhar → **Adicionar à Tela de Início**; no Android, Chrome →
menu → **Instalar app**. Abre sem barra de endereço, com o ícone da Tenvê e o
nome "Tenvê".

Isso vem de `public/manifest.webmanifest` mais as metas `apple-mobile-web-app-*`
no `index.html`.

A barra de status falsa (o "9:41") e o indicador de home só aparecem na moldura
de celular do desktop. Abaixo de 720 px os dois somem, porque aí quem desenha os
de verdade é o aparelho — do indicador sobra só o recuo de
`safe-area-inset-bottom`, quando o sistema reserva um.

Só funciona pela URL hospedada, com o `index.html` na raiz — não pelo arquivo
único nem por uma página dentro de um iframe, que aí o que é salvo na tela de
início é a página de fora.

## O que dá para fazer

| Fluxo | Caminho |
|---|---|
| Login | splash → e-mail e senha (já preenchidos; qualquer valor válido entra) |
| Lista de vistorias | filtros por status, agrupamento, cartões clicáveis |
| Busca | lupa no topo → filtra por placa, UF, data, solicitante, com destaque do trecho |
| Detalhe da vistoria | informações, progresso, valores → laudo em PDF ou continuar a vistoria |
| Nova vistoria | 7 etapas: solicitante → hub → veículo, fotos, pintura, extras, checklist, observações → enviada |
| Pesquisas | lista, busca, nova pesquisa (resultado chega sozinho em ~5 s), detalhe e laudo cautelar |
| Perfil | dados do vistoriador, menu e sair da conta |

Detalhes interativos: os quadros de foto "capturam" no toque, as faixas de
mícrons do teste de pintura selecionam e desbotam as demais, o checklist trava
o botão até responder tudo, e "Finalizar vistoria" só habilita com as etapas
obrigatórias concluídas.

## Design system

Todo o estilo mora em [`src/styles.css`](src/styles.css). O topo do arquivo é a
camada de tokens; o resto são as regras de componente, que só consomem token.

### Cor

Os nomes são os mesmos das variáveis do arquivo do Figma — `--forest`,
`--ink-500`, `--lime-soft`, `--danger-soft` e assim por diante. O que **não**
veio do arquivo está marcado com `(aprox.)` no comentário: são estados de hover
e alguns cinzas de apoio que o Figma não define.

Dois casos à parte, também comentados: os degradês do acesso foram amostrados do
render (as matrizes de gradiente do Figma não convertem direto para CSS), e o
laudo tem paleta própria escopada em `.laudo`, porque é um relatório impresso e
não usa os tokens do app.

### Tipografia

Um token por estilo de texto do Figma, com o mesmo nome. Tracking vem separado
porque não cabe no atalho `font`:

```css
font: var(--ts-text-s); letter-spacing: var(--tk-text-s);
```

| token | Figma | valor |
|---|---|---|
| `--ts-display-m` | Display/M | 600 24/30, -0.3 |
| `--ts-heading-l` | Heading/L | 600 20/26, -0.2 |
| `--ts-text-l` | Text/L | 400 16/24 |
| `--ts-text-m` | Text/M | 400 15/22 |
| `--ts-text-s` | Text/S | 400 13/18 |
| `--ts-action-l` | Action/L | 600 16/20, -0.1 |
| `--ts-action-s` | Action/S | 600 14/18 |
| `--ts-label-m` | Label/M | 500 13/18 |
| `--ts-label-s` | Label/S | 500 11/14, +0.3 |
| `--ts-mono-data` | Mono/Data | 500 13/18 |
| `--ts-mono-plate` | Mono/Plate | 600 17/24, +1.5 |

Há também classes utilitárias `.ts-display-m`, `.ts-text-s` etc., para aplicar
direto no markup ou copiar para outro projeto.

Alguns pontos usam tamanho fora da escala — a placa da fileira (mono 20/26), o
contador de fotos (17/22), o rótulo do chip (14/18). Estão escritos por extenso
na regra, com comentário, em vez de virar token: são exceções do desenho, não
degraus de uma escala.

### Medida

Só o que se repete e tem significado virou token: `--gutter` (20px, margem
lateral das telas), `--gap-secao` (22px, da barra de navegação ao conteúdo),
`--gap-campo` (16px), `--alt-campo` (56px) e os quatro raios. Medida de uma tela
só continua literal na regra, com comentário dizendo que veio do arquivo — por
exemplo o `27px` do campo de busca, que existe porque no Figma ele começa em
y=129.

### Uma divergência conhecida

O `Group Header` tem 34px no arquivo e 40px aqui (padding 14/8 + linha de 18).
Não mexi para não alterar o layout que você já validou, mas quem for refazer a
UI deve seguir o arquivo.

## Movimento

Só transição de tela — nada de elemento se transformando entre uma e outra.
GSAP cuida do deslize; os tokens ficam em [`src/motion.js`](src/motion.js).

```
D.tela 0.34s   deslize entre telas (avançar/voltar)
D.aba  0.38s   slide entre abas (percurso é a largura inteira)
D.fade 0.22s   crossfade (reset de pilha)
```

Cada navegação declara o tipo em `nav.go(tela, params, tipo)`:

| tipo | quando | o que faz |
|---|---|---|
| `push` | avançar (padrão de `nav.go`) | tela entra pela direita, a anterior recua um pouco e some |
| `pop` | voltar (padrão de `nav.back`) | o inverso |
| `aba` | tocar na barra de navegação | as duas telas percorrem a largura inteira, como um carrossel |
| `fade` | resetar a pilha (login, concluir) | crossfade curto |

O sentido do slide entre abas vem da posição do item na barra: a ordem está em
`ABAS` no `App.jsx` (`vistorias`, `pesquisas`, `perfil`). Ir para uma aba mais à
direita traz a tela pela direita; para uma mais à esquerda, pela esquerda. Tocar
na aba que já está ativa não faz nada.

As duas telas convivem durante a transição — a que sai fica montada até a
animação terminar. Se uma nova navegação começa no meio, a anterior é levada ao
estado final antes, para não sobrar `transform` pendurado.

`prefers-reduced-motion` corta a animação e vai direto ao estado final.

## Estrutura

```
src/
  App.jsx          navegação (pilha + abas) e estado da aplicação
  data.js          dados mock, listas do fluxo e tokens de conteúdo
  ui.jsx           componentes compartilhados (botões, campos, cartões, barras)
  motion.js        tokens de movimento e transição de tela
  icons.jsx        carrega os SVGs exportados e injeta inline
  styles.css       tokens de cor/tipografia extraídos das variáveis do Figma
  screens/         uma tela (ou grupo de telas) por arquivo
  assets/
    icons/         70 ícones exportados do Figma (página Componentes → Icon)
    img/           logo, wordmark e QR do laudo exportados do Figma
```

As cores e fontes vêm das variáveis do arquivo do Figma: `brand/lime #7edf20`,
`brand/forest #04662b`, `ink/900 #0b1410`, `surface/canvas #f2f4f0`,
tipografia Geist + Geist Mono.

## Assets

Nada de ícone redesenhado à mão: os 70 SVGs em `src/assets/icons/` saíram do
frame `Icon` (nó 73:123) da página **Componentes**, cada um recortado do export
com o `viewBox` da sua posição na folha. A única mudança em relação ao arquivo
original é `stroke="currentColor"` no lugar do `#0B1410` fixo, para o ícone
herdar a cor de onde está — a geometria é idêntica.

Para trocar ou adicionar um ícone basta exportar o SVG do Figma e salvar em
`src/assets/icons/<nome>.svg`; ele passa a estar disponível como
`<Icon name="<nome>" />` sem nenhum outro passo.

Em `src/assets/img/`: `logo-tenve.png` (pictograma), `wordmark-tenve.png`
(logotipo do splash e do login) e `qr-laudo.png` (o QR do cabeçalho do laudo).

O fundo do acesso é degradê, não imagem: o Figma usa um radial no splash e um
linear no login, com matrizes de transformação que não traduzem direto para
CSS. Os valores em `styles.css` foram amostrados do render do próprio arquivo —
`linear-gradient(138deg,#348b54,#06542a)` no splash e
`linear-gradient(158deg,#2a7e48,#044f1e)` no login.

## Fora do escopo

Os itens do menu do perfil, "Esqueci minha senha" e "Compartilhar laudo" abrem
um aviso — não existem telas para eles no Figma. As legendas das fotos 07/08
(Chassi, Motor) e os itens do checklist foram completados por conta própria:
no Figma esse conteúdo está dentro de instâncias de componente e não ficou
exposto.

Nas linhas da lista de vistorias o Figma usa duas instâncias soltas do plugin
Lucide (`calendar-fold` e `map-pin`) em vez dos ícones da biblioteca do próprio
arquivo. Elas são exportadas como formas preenchidas, uma camada por arquivo e
sem posicionamento, então aqui ficaram o `calendar` e o `map-pin` da biblioteca
do arquivo — a diferença é o canto dobrado do calendário, invisível a 13 px.
