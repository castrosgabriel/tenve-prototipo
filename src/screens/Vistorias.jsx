import { useMemo, useState } from 'react'
import Icon from '../icons'
import { FILTROS, GROUP_ORDER, STATUS } from '../data'
import {
  ActionBar, AppBar, Bar, Button, Card, DataRow, Fab, GroupHeader, Highlight, Pill, StepBar,
} from '../ui'

function Row({ v, onClick, query }) {
  return (
    <button className="listrow" onClick={onClick}>
      <div className="top">
        <div>
          <div className="plate"><Highlight text={v.placa} query={query} /></div>
          <div className="price">{v.valor}</div>
        </div>
        <Pill status={v.status} />
      </div>
      <div className="sep" />
      <div className="meta">
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Icon name="calendar" size={13} />{v.data}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Icon name="map-pin" size={13} />{v.uf}
        </span>
        <span className="right">{v.laudo}</span>
      </div>
    </button>
  )
}

export function ListaVistorias({ nav, store }) {
  const [filtro, setFiltro] = useState('todos')
  const lista = store.vistorias.filter(v => filtro === 'todos' || v.status === filtro)

  const grupos = GROUP_ORDER
    .map(g => ({ g, itens: lista.filter(v => v.status === g) }))
    .filter(x => x.itens.length)

  return (
    <>
      <AppBar title="Vistorias" onSearch={() => nav.go('busca-vistorias')} />
      <div className="filters">
        {FILTROS.map(f => (
          <button key={f.id} className={`fpill${filtro === f.id ? ' on' : ''}`} onClick={() => setFiltro(f.id)}>
            {f.label}
          </button>
        ))}
      </div>
      <div className="scroll" style={{ paddingBottom: 100 }}>
        {grupos.map(({ g, itens }) => (
          <div key={g}>
            <GroupHeader label={STATUS[g].group} count={itens.length} />
            {itens.map(v => <Row key={v.id} v={v} onClick={() => nav.go('vistoria', { id: v.id })} />)}
          </div>
        ))}
        {!grupos.length && (
          <div className="empty">
            <Icon name="clipboard-list" size={34} /><br />
            Nenhuma vistoria neste filtro.
          </div>
        )}
      </div>
      <Fab onClick={() => { store.iniciarVistoria(); nav.go('nv-solicitante') }}>Nova vistoria</Fab>
    </>
  )
}

export function BuscaVistorias({ nav, store }) {
  const [q, setQ] = useState('')
  const termo = q.trim().toLowerCase()

  const res = useMemo(() => {
    if (!termo) return []
    return store.vistorias.filter(v =>
      [v.placa, v.uf, v.data, v.solicitante, v.vistoriador, STATUS[v.status].label]
        .join(' ').toLowerCase().includes(termo))
  }, [termo, store.vistorias])

  return (
    <>
      <StepBar title="Buscar em vistorias" onBack={nav.back} />
      <div className="searchwrap">
        <div className="searchbox">
          <Icon name="search" size={20} color="#04662b" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Placa, Local, Nome, Data" />
          {q ? (
            <button className="iconbtn" style={{ width: 28, height: 28 }} onClick={() => setQ('')} aria-label="Limpar">
              <Icon name="x" size={18} />
            </button>
          ) : <Icon name="filter" size={18} color="#6b7a72" />}
        </div>
      </div>
      <div className="grouphdr">
        <span>{termo ? 'Vistorias encontradas' : 'Comece a escrever para ver as vistorias.'}</span>
        <span>{termo ? res.length : 0}</span>
      </div>
      <div className="scroll">
        {res.map(v => <Row key={v.id} v={v} query={q.trim()} onClick={() => nav.go('vistoria', { id: v.id })} />)}
        {termo && !res.length && (
          <div className="empty">
            <Icon name="search" size={34} /><br />
            Nada encontrado para “{q}”.<br />Tente outra placa, local ou data.
          </div>
        )}
      </div>
    </>
  )
}

export function DetalheVistoria({ nav, store, params }) {
  const v = store.vistorias.find(x => x.id === params.id)
  if (!v) return null
  const pct = Math.round((v.etapas / v.total) * 100)

  return (
    <>
      <StepBar title="Vistoria" onBack={nav.back}
        sub={<span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>{v.placa} · {v.tipo}</span>
          <Pill status={v.status} />
        </span>} />
      <div className="scroll pad" style={{ paddingTop: 16 }}>
        <Card title="Informações">
          <DataRow k="Placa" v={v.placa} mono />
          <DataRow k="Tipo" v={v.tipo} />
          <DataRow k="Data" v={v.data} />
          <DataRow k="Solicitante" v={v.solicitante} />
          <DataRow k="Vistoriador" v={v.vistoriador} />
        </Card>

        <Card title="Progresso">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 10 }}>
            <span>{v.etapas} de {v.total} etapas concluídas</span>
            <span style={{ color: '#04662b', fontWeight: 600 }}>{pct}%</span>
          </div>
          <Bar value={v.etapas / v.total} />
        </Card>

        <Card title="Valores">
          <DataRow k="Valor cobrado" v={v.valor} />
          <DataRow k="Laudo" v={v.laudo.replace('Laudo ', '')} />
        </Card>

        {v.status === 'expirado' && (
          <div className="note note-warn" style={{ marginTop: 4 }}>
            <Icon name="alert-triangle" size={18} color="#ff8027" />
            <div><b>Pagamento expirado</b>Gere um novo pagamento para liberar o laudo deste veículo.</div>
          </div>
        )}
      </div>
      <ActionBar>
        {v.etapas < v.total ? (
          <Button onClick={() => { store.retomarVistoria(v); nav.go('nv-hub') }}>Continuar vistoria</Button>
        ) : (
          <Button onClick={() => nav.go('laudo', { placa: v.placa, numero: '217', origem: 'Vistoria' })}>
            Ver laudo em PDF
          </Button>
        )}
      </ActionBar>
    </>
  )
}
