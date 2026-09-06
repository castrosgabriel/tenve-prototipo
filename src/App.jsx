import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import './styles.css'
import { HomeIndicator, StatusBar, TabBar } from './ui'
import { PESQUISAS, VISTORIAS, agora, novoRascunho, proximoId } from './data'
import { animarTransicao } from './motion'
import { Login, Splash } from './screens/Login'
import { BuscaVistorias, DetalheVistoria, ListaVistorias } from './screens/Vistorias'
import * as NV from './screens/NovaVistoria'
import { BuscaPesquisas, DetalhePesquisa, ListaPesquisas, NovaPesquisa, PesquisaEnviada } from './screens/Pesquisas'
import Laudo from './screens/Laudo'
import Perfil from './screens/Perfil'

// ordem das abas na barra — é ela que define para que lado a tela desliza
const ABAS = ['vistorias', 'pesquisas', 'perfil']
const COM_TABBAR = ABAS
const ACESSO = ['splash', 'login']

const TELAS = {
  splash: Splash,
  login: Login,
  vistorias: ListaVistorias,
  'busca-vistorias': BuscaVistorias,
  vistoria: DetalheVistoria,
  'nv-solicitante': NV.Solicitante,
  'nv-hub': NV.Hub,
  'nv-veiculo': NV.Veiculo,
  'nv-fotos': NV.Fotos,
  'nv-pintura': NV.Pintura,
  'nv-extras': NV.Extras,
  'nv-checklist': NV.Checklist,
  'nv-obs': NV.Observacoes,
  'nv-enviada': NV.Enviada,
  pesquisas: ListaPesquisas,
  'busca-pesquisas': BuscaPesquisas,
  'pesquisa-nova': NovaPesquisa,
  'pesquisa-enviada': PesquisaEnviada,
  pesquisa: DetalhePesquisa,
  laudo: Laudo,
  perfil: Perfil,
}

export default function App() {
  const [pilha, setPilha] = useState([{ nome: 'splash', params: {}, k: 0 }])
  const [saindo, setSaindo] = useState(null)
  const [transicao, setTransicao] = useState({ tipo: 'fade', dir: 1 })
  const [aba, setAba] = useState('vistorias')
  const [usuario, setUsuario] = useState(null)
  const [vistorias, setVistorias] = useState(VISTORIAS)
  const [pesquisas, setPesquisas] = useState(PESQUISAS)
  const [rascunho, setRascunho] = useState(novoRascunho())
  const [editando, setEditando] = useState(null)
  const [ultimoLaudo, setUltimoLaudo] = useState(217)

  const refEntrando = useRef(null)
  const refSaindo = useRef(null)
  const tlRef = useRef(null)
  const pilhaRef = useRef(pilha)
  const seq = useRef(1)
  const primeira = useRef(true)
  pilhaRef.current = pilha

  // --- navegação -----------------------------------------------------------
  // tipo: 'push' (avança) | 'pop' (volta) | 'fade' | 'aba'
  const navegar = useCallback((proximaPilha, tipo, dir = 1) => {
    setSaindo(pilhaRef.current[pilhaRef.current.length - 1])
    setTransicao({ tipo, dir })
    setPilha(proximaPilha)
  }, [])

  const nav = useMemo(() => ({
    go: (nome, params = {}, t = 'push') =>
      navegar(p => [...p, { nome, params, k: seq.current++ }], t),
    back: (t = 'pop') =>
      navegar(p => (p.length > 1 ? p.slice(0, -1) : p), t),
    reset: (nome, params = {}, t = 'fade') =>
      navegar([{ nome, params, k: seq.current++ }], t),
    aba: (nome, dir) => navegar([{ nome, params: {}, k: seq.current++ }], 'aba', dir),
  }), [navegar])

  // --- animação da troca de tela ------------------------------------------
  useLayoutEffect(() => {
    // toque rápido: encerra a transição anterior no estado final antes de abrir outra,
    // senão sobram transform/opacity pendurados na tela
    if (tlRef.current) { tlRef.current.progress(1, false).kill(); tlRef.current = null }

    const tl = animarTransicao({
      entrando: refEntrando.current,
      saindo: refSaindo.current,
      tipo: primeira.current ? 'fade' : transicao.tipo,
      dir: transicao.dir,
    })
    primeira.current = false
    tlRef.current = tl
    const finalizar = (forcar) => {
      const anim = tlRef.current
      tlRef.current = null
      if (forcar && anim) anim.progress(1, false)   // false = deixa os callbacks rodarem
      setSaindo(s => (s ? null : s))
    }
    tl.eventCallback('onComplete', () => finalizar(false))
    // rede de segurança: se o rAF parar no meio (aba em segundo plano, por exemplo)
    // a tela não pode ficar a meio fade nem a anterior empilhada sobre a nova
    const t = setTimeout(() => finalizar(true), (tl.duration() + 0.25) * 1000)
    return () => clearTimeout(t)
  }, [pilha]) // eslint-disable-line react-hooks/exhaustive-deps

  const atual = pilha[pilha.length - 1]

  const store = useMemo(() => ({
    usuario, vistorias, pesquisas, rascunho, ultimoLaudo,
    setUsuario,
    setRascunho,

    sair() {
      setUsuario(null)
      setRascunho(novoRascunho())
      setAba('vistorias')
      nav.reset('login')
    },

    iniciarVistoria() {
      setEditando(null)
      setRascunho(novoRascunho())
    },

    retomarVistoria(v) {
      setEditando(v.id)
      setRascunho(r => ({
        ...novoRascunho(),
        veiculo: {
          ...novoRascunho().veiculo, placa: v.placa,
          tipo: v.tipo.split(' · ')[0], pintura: v.tipo.split(' · ')[1] || 'Com pintura',
        },
        solicitante: { nome: v.solicitante, telefone: '(51) 99999-0000', email: 'solicitante@exemplo.com' },
        feito: { veiculo: true, fotos: v.etapas > 2, pintura: v.etapas > 3, extras: false, checklist: v.etapas > 5, obs: false },
      }))
    },

    concluirEtapa(id) {
      setRascunho(r => ({ ...r, feito: { ...r.feito, [id]: true } }))
    },

    salvarRascunho() {
      setVistorias(list => {
        const r = rascunho
        const feitas = 1 + Object.values(r.feito).filter(Boolean).length
        const base = {
          placa: r.veiculo.placa || 'SEM PLACA', valor: 'R$ 32,50', data: agora(), uf: 'RS',
          laudo: 'Laudo completo', status: 'andamento',
          tipo: `${r.veiculo.tipo} · ${r.veiculo.pintura}`,
          vistoriador: usuario?.nome || 'Miguel Henrique',
          etapas: feitas, total: 7, solicitante: r.solicitante.nome || '—',
        }
        if (editando) return list.map(v => (v.id === editando ? { ...v, ...base } : v))
        return [{ id: proximoId('v', list), ...base }, ...list]
      })
    },

    finalizarVistoria() {
      const numero = ultimoLaudo
      const r = rascunho
      const nova = {
        placa: r.veiculo.placa || 'SEM PLACA', valor: 'R$ 32,50', data: agora(), uf: 'RS',
        laudo: 'Laudo completo', status: 'concluida',
        tipo: `${r.veiculo.tipo} · ${r.veiculo.pintura}`,
        vistoriador: usuario?.nome || 'Miguel Henrique',
        etapas: 7, total: 7, solicitante: r.solicitante.nome || '—',
      }
      setVistorias(list => (editando
        ? list.map(v => (v.id === editando ? { ...v, ...nova } : v))
        : [{ id: proximoId('v', list), ...nova }, ...list]))
      setUltimoLaudo(n => n + 1)
      setEditando(null)
      return numero
    },

    criarPesquisa(f) {
      const numero = String(193 + pesquisas.length - PESQUISAS.length)
      const nova = {
        id: proximoId('p', pesquisas), placa: f.placa, valor: 'R$ 65,00', servico: 'R$ 30,00',
        data: agora(), numero, status: 'andamento', solicitante: f.nome,
        hist: [['Buscando dados', agora()]],
      }
      setPesquisas(l => [nova, ...l])
      setTimeout(() => {
        setPesquisas(l => l.map(p => (p.id === nova.id
          ? { ...p, status: 'concluida', hist: [...p.hist, ['Concluída', agora()]] }
          : p)))
      }, 5000)
      return nova
    },
  }), [usuario, vistorias, pesquisas, rascunho, editando, ultimoLaudo, nav])

  // a tela vem do lado em que a aba está: mais à direita na barra, entra pela direita
  const trocarAba = useCallback(id => {
    const de = ABAS.indexOf(aba)
    const para = ABAS.indexOf(id)
    if (de === para) return
    setAba(id)
    nav.aba(id, para > de ? 1 : -1)
  }, [aba, nav])

  const Tela = TELAS[atual.nome] || ListaVistorias
  const TelaSaindo = saindo ? (TELAS[saindo.nome] || ListaVistorias) : null
  const noAcesso = ACESSO.includes(atual.nome)

  return (
    <div className="stage">
      <div className={`phone${noAcesso ? ' phone--acesso' : ''}${atual.nome === 'splash' ? ' phone--splash' : ''}`}>
        <StatusBar />

        <div className="palco">
          {TelaSaindo && (
            <div className="screen" ref={refSaindo} key={`out-${saindo.k}`} aria-hidden="true">
              <TelaSaindo nav={nav} store={store} params={saindo.params} />
            </div>
          )}
          <div className="screen" ref={refEntrando} key={atual.k}>
            <Tela nav={nav} store={store} params={atual.params} />
          </div>
        </div>

        {COM_TABBAR.includes(atual.nome) && <TabBar active={aba} onChange={trocarAba} />}
        <HomeIndicator />
      </div>

      <div className="hint">
        <b>Protótipo Tenvê</b>
        Fluxo navegável a partir do Figma.
        <ul>
          <li>Entre com qualquer e-mail e senha</li>
          <li>Toque na lupa para buscar na lista</li>
          <li>“Nova vistoria” abre as 7 etapas</li>
          <li>Fotos e mícrons respondem ao toque</li>
          <li>A pesquisa fica pronta em ~5 s</li>
        </ul>
      </div>
    </div>
  )
}
