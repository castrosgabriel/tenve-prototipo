// Junta o build do Vite em um HTML único, para publicar sem servidor.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const dist = 'dist'
const html = readFileSync(join(dist, 'index.html'), 'utf8')
const assets = readdirSync(join(dist, 'assets'))
const ler = ext => readFileSync(join(dist, 'assets', assets.find(f => f.endsWith(ext))), 'utf8')

// o \/ impede que uma string do bundle feche a tag antes da hora
const js = ler('.js').replaceAll('</script', '<\\/script')
const css = ler('.css').replaceAll('</style', '<\\/style')

// as substituições PRECISAM ser função: como string, $& e $` dentro do bundle
// seriam interpretados como referências ao match e corromperiam o arquivo
const unico = html
  .replace(/<script type="module"[^>]*><\/script>/, () => `<script type="module">\n${js}\n</script>`)
  .replace(/<link rel="stylesheet"[^>]*>/, () => `<style>\n${css}\n</style>`)

// nas versões de arquivo único não existe /manifest.webmanifest nem /icon-*.png
// ao lado — as tags ficariam apontando para 404
const soltas = /\s*<link rel="(?:icon|apple-touch-icon|manifest)"[^>]*>/g
const unicoLimpo = unico.replace(soltas, '')

writeFileSync(join(dist, 'tenve.html'), unicoLimpo)

// versão sem <html>/<head>/<body> para publicar como página hospedada,
// onde esse invólucro é adicionado por fora
const miolo = unicoLimpo
  .replace(/^[\s\S]*?<head>/, '')
  .replace(/<\/head>\s*<body>/, '')
  .replace(/<\/body>\s*<\/html>\s*$/, '')
  .replace(/<meta charset[^>]*>\s*/, '')
  .replace(/<meta name="viewport"[^>]*>\s*/, '')
  .trim()
writeFileSync(join(dist, 'artifact.html'), miolo)

const kb = n => (n / 1024).toFixed(0) + ' KB'
console.log(`dist/tenve.html    ${kb(Buffer.byteLength(unicoLimpo))}  (js ${kb(js.length)} + css ${kb(css.length)})`)
console.log(`dist/artifact.html ${kb(Buffer.byteLength(miolo))}  (sem invólucro html/head/body)`)
