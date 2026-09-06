# Tenvê · protótipo navegável

Aplicação React que reproduz o fluxo do app Tenvê a partir do Figma
([App · Telas](https://www.figma.com/design/0d8nOPNoqFkTeUO61dQTbQ/Tenv%C3%AA?node-id=279-3780)).
Estado em memória — nada é persistido, é só para clicar e testar.

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
(logotipo do splash e do login), `qr-laudo.png` (o QR do cabeçalho do laudo) e
os dois fundos verdes do acesso.

A forma verde do splash e do login é o mesmo vetor no Figma (`Vector 4`), com
blur — que não sobrevive a uma aproximação em CSS. Ela vem como PNG @2x já
recortada na largura da tela, em duas versões porque o vetor aparece em
posições diferentes nas duas telas: `splash-blob.png` (412×682) e
`hero-blob.png` (412×337). O PNG é aplicado como fundo do aparelho, atrás da
status bar, como no arquivo.

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
