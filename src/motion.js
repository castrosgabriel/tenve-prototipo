import gsap from 'gsap'

/* ---------- tokens de movimento ----------
   Transição de tela e nada além disso: a tela entra, a anterior sai.
   Mexa aqui primeiro — o resto do app lê estes valores.                     */
export const D = {
  tela: 0.34,   // deslize entre telas (avançar/voltar)
  aba: 0.38,    // slide entre abas (percurso é a largura inteira)
  fade: 0.22,   // crossfade (reset de pilha)
}

export const E = {
  suave: 'power2.out',
  duplo: 'power2.inOut',
}

const DESLIZE = 14   // quantos % da largura a tela percorre ao entrar

export const reduzido = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Anima a troca de tela.
 * tipo: 'push' (avança) | 'pop' (volta) | 'fade' | 'aba' (slide de largura inteira)
 * dir:  1 = a tela nova vem da direita, -1 = vem da esquerda (só no 'aba')
 */
export function animarTransicao({ entrando, saindo, tipo, dir = 1 }) {
  const tl = gsap.timeline()

  if (reduzido() || !entrando) {
    if (saindo) gsap.set(saindo, { opacity: 0 })
    return tl
  }

  // troca de aba: as duas telas percorrem a largura inteira, como um carrossel,
  // no sentido em que a aba está na barra
  if (tipo === 'aba') {
    tl.fromTo(entrando,
      { xPercent: 100 * dir },
      { xPercent: 0, duration: D.aba, ease: E.duplo, clearProps: 'transform' }, 0)
    if (saindo) tl.to(saindo, { xPercent: -100 * dir, duration: D.aba, ease: E.duplo }, 0)
    return tl
  }

  if (tipo === 'fade') {
    tl.fromTo(entrando, { opacity: 0 }, { opacity: 1, duration: D.fade, ease: 'none', clearProps: 'opacity' }, 0)
    if (saindo) tl.to(saindo, { opacity: 0, duration: D.fade, ease: 'none' }, 0)
    return tl
  }

  const sentido = tipo === 'pop' ? -1 : 1
  tl.fromTo(entrando,
    { xPercent: DESLIZE * sentido },
    { xPercent: 0, duration: D.tela, ease: E.suave, clearProps: 'transform' }, 0)
  if (saindo) {
    tl.to(saindo, { xPercent: -DESLIZE * 0.4 * sentido, opacity: 0, duration: D.tela, ease: E.suave }, 0)
  }
  return tl
}

export { gsap }
