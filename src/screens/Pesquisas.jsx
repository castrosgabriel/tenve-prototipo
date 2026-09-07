import { useMemo, useState } from 'react'
import Icon from '../icons'
import { ActionBar, AppBar, Button, Card, DataRow, Fab, Field, GroupHeader, Highlight, IconRow, Note, Pill, StepBar } from '../ui'

function Row({ p, onClick, query }) {
  return (
    <button className="listrow" onClick={onClick}>
      <div className="top">
        <div>
          <div className="plate"><Highlight text={p.placa} query={query} /></div>
          <div className="price">{p.valor}</div>
        </div>
        <Pill status={p.status} />
      </div>
      <div className="sep" />
      <div className="meta">
        <span className="meta-item"><Icon name="calendar" size={13} />{p.data}</span>
        <span className="right">Pesquisa nº {p.numero}</span>
      </div>
    </button>
  )
}

export function ListaPesquisas({ nav, store }) {
  const grupos = ['andamento', 'concluida']
    .map(g => ({ g, itens: store.pesquisas.filter(p => p.status === g) }))
    .filter(x => x.itens.length)

  return (
    <>
      <AppBar title="Pesquisas" onSearch={() => nav.go('busca-pesquisas')} />
      <div className="scroll scroll--lista">
        {grupos.map(({ g, itens }) => (
          <div key={g}>
            <GroupHeader label={g === 'andamento' ? 'Em andamento' : 'Concluídas'} count={itens.length} />
            {itens.map(p => <Row key={p.id} p={p} onClick={() => nav.go('pesquisa', { id: p.id })} />)}
          </div>
        ))}
        {!grupos.length && (
          <div className="empty"><Icon name="car" size={34} /><br />Nenhuma pesquisa por aqui ainda.</div>
        )}
      </div>
      <Fab onClick={() => nav.go('pesquisa-nova')}>Nova pesquisa</Fab>
    </>
  )
}

export function BuscaPesquisas({ nav, store }) {
  const [q, setQ] = useState('')
  const termo = q.trim().toLowerCase()
  const res = useMemo(() => {
    if (!termo) return []
    return store.pesquisas.filter(p =>
      [p.placa, p.data, p.numero, p.solicitante].join(' ').toLowerCase().includes(termo))
  }, [termo, store.pesquisas])

  return (
    <>
      <StepBar title="Buscar em pesquisas" onBack={nav.back} />
      <div className="searchwrap">
        <div className="searchbox">
          <Icon name="search" size={20} color="#04662b" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Placa, Nº, Nome, Data" />
          {q ? (
            <button className="iconbtn" className="iconbtn iconbtn--sm" onClick={() => setQ('')} aria-label="Limpar">
              <Icon name="x" size={18} />
            </button>
          ) : <Icon name="filter" size={18} color="#6b7a72" />}
        </div>
      </div>
      <div className="grouphdr">
        <span>{termo ? 'Pesquisas encontradas' : 'Comece a escrever para ver as pesquisas.'}</span>
        <span>{termo ? res.length : 0}</span>
      </div>
      <div className="scroll">
        {res.map(p => <Row key={p.id} p={p} query={q.trim()} onClick={() => nav.go('pesquisa', { id: p.id })} />)}
        {termo && !res.length && (
          <div className="empty"><Icon name="search" size={34} /><br />Nada encontrado para “{q}”.</div>
        )}
      </div>
    </>
  )
}

export function NovaPesquisa({ nav, store }) {
  const [f, setF] = useState({ placa: '', confirma: '', nome: '', telefone: '', email: store.usuario?.email || '' })
  const [erro, setErro] = useState({})
  const set = (k, v) => setF(s => ({ ...s, [k]: v }))

  function continuar() {
    const e = {}
    if (!/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(f.placa)) e.placa = 'Placa inválida. Use ABC1234 ou ABC1D23.'
    if (f.confirma !== f.placa) e.confirma = 'As placas não conferem.'
    if (!f.nome.trim()) e.nome = 'Informe o nome do solicitante.'
    if (!f.telefone.trim()) e.telefone = 'Informe um telefone.'
    if (!f.email.includes('@')) e.email = 'Informe um e-mail válido.'
    setErro(e)
    if (Object.keys(e).length) return
    const nova = store.criarPesquisa(f)
    nav.go('pesquisa-enviada', { id: nova.id })
  }

  return (
    <>
      <StepBar title="Nova pesquisa" onBack={nav.back} sub="Histórico do veículo pela placa" />
      <div className="scroll pad scroll--topo">
        <Note tone="lime" icon="search">
          Informe a placa e receba o histórico do veículo em PDF após o pagamento. Sem vistoria presencial.
        </Note>
        <div className="secao">Veículo</div>
        <Field label="Placa" required icon="car" error={erro.placa} value={f.placa} placeholder="ABC1D23"
          onChange={e => set('placa', e.target.value.toUpperCase().slice(0, 7))} />
        <Field label="Confirme a placa" required icon="car" error={erro.confirma} value={f.confirma} placeholder="ABC1D23"
          onChange={e => set('confirma', e.target.value.toUpperCase().slice(0, 7))} />

        <div className="secao secao--espacada">Solicitante</div>
        <Field label="Nome" required icon="user" error={erro.nome} value={f.nome} placeholder="Nome do solicitante"
          onChange={e => set('nome', e.target.value)} />
        <Field label="Telefone" required icon="phone" error={erro.telefone} value={f.telefone} placeholder="(11) 99999-9999"
          onChange={e => set('telefone', e.target.value)} />
        <Field label="E-mail" required icon="mail" error={erro.email} value={f.email} placeholder="voce@tenve.com"
          onChange={e => set('email', e.target.value)} />
      </div>
      <ActionBar><Button onClick={continuar}>Continuar</Button></ActionBar>
    </>
  )
}

export function PesquisaEnviada({ nav, store, params }) {
  const p = store.pesquisas.find(x => x.id === params.id)
  return (
    <>
      <StepBar title="Pesquisa enviada" onBack={() => nav.reset('pesquisas')} sub={`Laudo #${p?.numero}`} />
      <div className="scroll pad scroll--topo">
        <div className="note note-lime aviso-sucesso">
          <span className="successicon"><Icon name="check" size={22} strokeWidth={3} color="#fff" /></span>
          <div>
            <b>Pesquisa liberada</b>
            Sem pagamento nesta etapa — a cobrança é feita na conta da franquia.
            A pesquisa já entrou na fila de análise.
          </div>
        </div>
        <Card>
          <DataRow k="Status" v={p?.status === 'concluida' ? 'Concluída' : 'Buscando dados do veículo'} strong />
          <DataRow k="Modalidade" v="Conta da franquia" />
          <DataRow k="Placa" v={p?.placa} mono />
        </Card>
        <div className="rodape-nota">
          {p?.status === 'concluida' ? 'Resultado disponível.' : 'O resultado costuma sair em poucos segundos…'}
        </div>
      </div>
      <ActionBar><Button onClick={() => nav.reset('pesquisas')}>Concluir</Button></ActionBar>
    </>
  )
}

export function DetalhePesquisa({ nav, store, params }) {
  const p = store.pesquisas.find(x => x.id === params.id)
  if (!p) return null
  return (
    <>
      <StepBar title="Detalhes da pesquisa" onBack={nav.back}
        sub={<span className="linha-icone">
          <span className="mono">{p.placa}</span>
          <Pill status={p.status} />
        </span>} />
      <div className="scroll pad scroll--topo">
        <Card title="Informações">
          <IconRow icon="car" k="Placa" v={p.placa} mono />
          <IconRow icon="clipboard-list" k="Nº da pesquisa" v={`#${p.numero}`} />
          <IconRow icon="file-text" k="Tipo de serviço" v="Pesquisa veicular" />
          <IconRow icon="user" k="Solicitante" v={p.solicitante} />
        </Card>
        <Card title="Valores">
          <DataRow k="Valor cobrado" v={p.valor} />
          <DataRow k="Valor do serviço" v={p.servico} />
        </Card>
        <Card title="Histórico">
          {p.hist.map(([t, d], i) => (
            <div key={i} className={`hist${i === p.hist.length - 1 ? ' atual' : ''}`}>
              <span className="ponto" />
              <div>
                <div className="t">{t}</div>
                <div className="q"><Icon name="clock" size={13} />{d}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>
      <ActionBar>
        <Button disabled={p.status !== 'concluida'}
          onClick={() => nav.go('laudo', { placa: p.placa, numero: p.numero, origem: 'Pesquisa' })}>
          {p.status === 'concluida' ? 'Ver pesquisa em PDF' : 'Aguardando resultado'}
        </Button>
      </ActionBar>
    </>
  )
}
