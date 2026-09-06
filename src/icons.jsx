// Ícones exportados do Figma (página "Componentes" → frame Icon, 73:123).
// Os arquivos em assets/icons/*.svg são o export original; aqui eles só são
// injetados inline para herdar cor (currentColor) e tamanho.
const arquivos = import.meta.glob('./assets/icons/*.svg', {
  query: '?raw', import: 'default', eager: true,
})

const ICONES = {}
for (const caminho in arquivos) {
  const nome = caminho.split('/').pop().replace('.svg', '')
  ICONES[nome] = arquivos[caminho].replace('width="24" height="24"', 'width="100%" height="100%"')
}

export const NOMES = Object.keys(ICONES)

export default function Icon({ name, size = 20, color, strokeWidth, style }) {
  const svg = ICONES[name]
  if (!svg) {
    if (import.meta.env.DEV) console.warn(`[Icon] "${name}" não existe no export do Figma`)
    return null
  }
  return (
    <span
      className="ico"
      aria-hidden="true"
      style={{ width: size, height: size, color, '--sw': strokeWidth, ...style }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
